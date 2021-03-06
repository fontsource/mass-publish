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

    const checkedList = await bumpCheck(validList, "patch");
    expect(checkedList).toEqual(validList);
  });

  test("NPM unpublished", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    // eslint-disable-next-line unicorn/no-useless-undefined
    mockedLatestVersion.mockRejectedValue({
      name: "PackageNotFoundError",
    });

    const validList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];

    const checkedList = await bumpCheck(validList, "patch");
    expect(checkedList).toEqual(validList);
  });

  test("Same version exists", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    mockedLatestVersion.mockResolvedValue("1.0.1");

    const bumpList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];

    await expect(bumpCheck(bumpList, "patch")).rejects.toThrow();
  });

  test("From package", async () => {
    const mockedLatestVersion = mocked(latestVersion, false);
    mockedLatestVersion.mockResolvedValue("1.0.1");

    const bumpList: BumpObject[] = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "src/test",
        bumpedVersion: "1.0.1",
      },
    ];

    const list = await bumpCheck(bumpList, "from-package");
    expect(list[0].noPublish).toBe(true);
  });
});
