import chalk from "chalk";
import latestVersion from "latest-version";
import { mocked } from "ts-jest/utils";

import { bumpCheck } from "./bump-check";
import type { BumpObject } from "./interfaces/bump-object";

jest.mock("latest-version");

describe("Bump check", () => {
  let results: any;

  beforeEach(() => {
    results = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => results.push(String(val).trim()));
  });

  afterEach(() => jest.restoreAllMocks());

  test("No updates needed", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    mockedLatestVersion.mockResolvedValue("1.0.0");

    const validList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];

    const checkedList = await bumpCheck(validList);
    expect(checkedList).toEqual(validList);
  });

  test("NPM unpublished", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    // eslint-disable-next-line unicorn/no-useless-undefined
    mockedLatestVersion.mockRejectedValue(undefined);

    const validList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];

    const checkedList = await bumpCheck(validList);
    expect(checkedList).toEqual(validList);
  });

  test("Failed check, no autobump", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    mockedLatestVersion.mockResolvedValue("1.0.1");

    const bumpList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];
    const validList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
        failedValidation: true,
      },
    ];

    const checkedList = await bumpCheck(bumpList);
    expect(checkedList).toEqual(validList);
    expect(results).toEqual([
      "test-1 version mismatch. Failed to bump. Not publishing.",
    ]);
  });

  test("Autobump", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    mockedLatestVersion.mockResolvedValue("1.0.1");

    const bumpList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];
    const validList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.2",
      },
    ];

    const checkedList = await bumpCheck(bumpList, true);
    expect(checkedList).toEqual(validList);
    expect(results).toEqual([
      chalk.red(
        "test-1 version mismatch. NPM version 1.0.1. Bump value 1.0.1. Auto-bumping..."
      ),
    ]);
  });
});
