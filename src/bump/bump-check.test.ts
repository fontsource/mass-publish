import chalk from "chalk";
import latestVersion from "latest-version";

import { bumpCheck } from "./bump-check";

import { BumpObject } from "./interfaces/bump-object";

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
    jest.spyOn(latestVersion, "default").mockResolvedValue("1.0.0");

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

  test("Updates needed", async () => {
    jest.spyOn(latestVersion, "default").mockResolvedValue("1.0.1");

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

    const checkedList = await bumpCheck(bumpList);
    expect(checkedList).toEqual(validList);
    expect(results).toEqual(
      chalk.red(
        "test-1 version mismatch. NPM version 1.0.1. Bump value 1.0.1. Auto-bumping..."
      )
    );
  });
});
