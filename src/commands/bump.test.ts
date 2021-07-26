// file.only
import chalk from "chalk";
import { cli } from "cli-ux";
import path from "path";
import { mocked } from "ts-jest/utils";

import Bump from "./bump";
import { readConfig } from "../changed/read-config";
import { bumpWrite } from "../bump/bump-write";

import {
  exampleConfig1,
  exampleConfig2,
  exampleConfig3,
  exampleConfig4,
  exampleConfig5,
} from "../utils/helpers/test-configs";

jest.mock("../changed/read-config.ts");
jest.mock("../bump/bump-write.ts");

jest.setTimeout(100_000);

describe("Bump command", () => {
  let results: any;

  beforeEach(() => {
    results = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => results.push(String(val).trim()));
    jest
      .spyOn(process.stderr, "write")
      .mockImplementation(val => results.push(String(val).trim()));

    jest
      .spyOn(cli.action, "start")
      .mockImplementation(val => results.push(String(val).trim()));
    jest
      .spyOn(cli.action, "stop")
      .mockImplementation(val => results.push(String(val).trim()));

    jest.spyOn(cli, "confirm").mockImplementation(val => {
      results.push(String(val).trim());
      return Promise.resolve(true);
    });

    const mockedBumpWrite = mocked(bumpWrite);
    mockedBumpWrite.mockResolvedValue([]);
  });

  afterEach(() => jest.restoreAllMocks());

  test("success #1 - No updates", async () => {
    const mockedConfig = mocked(readConfig);
    mockedConfig.mockResolvedValue(exampleConfig1);

    await expect(Bump.run(["patch"])).rejects.toThrow(
      "No packages to update found."
    );

    await expect(Bump.run(["1.1.1"])).rejects.toThrow(
      "No packages to update found."
    );

    expect(results).toEqual([
      "Checking packages...",
      "!",
      "Checking packages...",
      "!",
    ]);
  });

  test("success #2 - All changes", async () => {
    const mockedConfig = mocked(readConfig);
    mockedConfig.mockResolvedValue(exampleConfig2);

    await expect(Bump.run(["minor"])).resolves.not.toThrow();

    expect(results).toEqual([
      "Checking packages...",
      `${path.join(
        "src",
        "changed",
        "fixtures",
        "test3",
        "package.json"
      )} may have been removed. Not publishing.`,
      "Done.",
      "Changed packages:",
      "test1: 1.0.0 --> 1.1.0",
      "test2: 1.1.0 --> 1.2.0",
      "Bump 2 packages?",
      "Writing updates...",
      "Done.",
    ]);
  });

  test("success #3 - Test 2 multi subdir", async () => {
    const mockedConfig = mocked(readConfig);
    mockedConfig.mockResolvedValue(exampleConfig3);

    await expect(Bump.run(["major"])).resolves.not.toThrow();

    expect(results).toEqual([
      "Checking packages...",
      "Done.",
      "Changed packages:",
      "test2: 1.1.0 --> 2.1.0",
      "Bump 1 packages?",
      "Writing updates...",
      "Done.",
    ]);
  });

  test("success #4 - Ignore ts files", async () => {
    const mockedConfig = mocked(readConfig);
    mockedConfig.mockResolvedValue(exampleConfig4);

    await expect(Bump.run(["major"])).rejects.toThrow(
      "No packages to update found."
    );

    expect(results).toEqual(["Checking packages...", "!"]);
  });

  test("success #5 - test 3 remove, 2 package change", async () => {
    const mockedConfig = mocked(readConfig);
    mockedConfig.mockResolvedValue(exampleConfig5);

    await expect(Bump.run(["5.12.35"])).resolves.not.toThrow();

    expect(results).toEqual([
      "Checking packages...",
      `${path.join(
        "src",
        "changed",
        "fixtures",
        "test3",
        "package.json"
      )} may have been removed. Not publishing.`,
      "Done.",
      "Changed packages:",
      "test1: 1.0.0 --> 5.12.35",
      "test2: 1.1.0 --> 5.12.35",
      "Bump 2 packages?",
      "Writing updates...",
      "Done.",
    ]);
  });
});
