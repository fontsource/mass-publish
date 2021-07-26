import { cli } from "cli-ux";
import chalk from "chalk";
import path from "path";
import { mocked } from "ts-jest/utils";

import Bump from "./bump";
import { bumpWrite } from "../bump/bump-write";

import {
  exampleConfig1,
  exampleConfig2,
  exampleConfig3,
  exampleConfig4,
  exampleConfig5,
} from "../utils/helpers/test-configs";
import { mockConfig } from "../utils/helpers/mock-config";

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
    mockConfig(exampleConfig1);

    await expect(Bump.run(["patch"])).rejects.toThrow(
      "No packages to update found."
    );

    await expect(Bump.run(["1.1.1"])).rejects.toThrow(
      "No packages to update found."
    );
  });

  test("success #2 - All changes", async () => {
    mockConfig(exampleConfig2);

    await expect(Bump.run(["minor"])).resolves.not.toThrow();

    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.red(
        `${path.join(
          "src",
          "changed",
          "fixtures",
          "test3",
          "package.json"
        )} may have been removed. Not publishing.`
      ),
      chalk.bold.green("Done."),
      chalk.bold.blue("Changed packages:"),
      chalk.magenta("test1: 1.0.0 --> 1.1.0"),
      chalk.magenta("test2: 1.1.0 --> 1.2.0"),
      chalk.bold.green("Bump 2 packages?"),
      chalk.blue("Writing updates..."),
      chalk.green("Done."),
    ]);
  });

  test("success #3 - Test 2 multi subdir", async () => {
    mockConfig(exampleConfig3);

    await expect(Bump.run(["major"])).resolves.not.toThrow();

    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.bold.green("Done."),
      chalk.bold.blue("Changed packages:"),
      chalk.magenta("test2: 1.1.0 --> 2.1.0"),
      chalk.bold.green("Bump 1 packages?"),
      chalk.blue("Writing updates..."),
      chalk.green("Done."),
    ]);
  });

  test("success #4 - Ignore ts files", async () => {
    mockConfig(exampleConfig4);

    await expect(Bump.run(["major"])).rejects.toThrow(
      "No packages to update found."
    );
  });

  test("success #5 - test 3 remove, 2 package change", async () => {
    mockConfig(exampleConfig5);

    await expect(Bump.run(["5.12.35"])).resolves.not.toThrow();

    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.red(
        `${path.join(
          "src",
          "changed",
          "fixtures",
          "test3",
          "package.json"
        )} may have been removed. Not publishing.`
      ),
      chalk.bold.green("Done."),
      chalk.bold.blue("Changed packages:"),
      chalk.magenta("test1: 1.0.0 --> 5.12.35"),
      chalk.magenta("test2: 1.1.0 --> 5.12.35"),
      chalk.bold.green("Bump 2 packages?"),
      chalk.blue("Writing updates..."),
      chalk.green("Done."),
    ]);
  });

  test("Incorrect bump arg", async () => {
    mockConfig(exampleConfig1);

    await expect(Bump.run(["a.b.c"])).rejects.toThrow(
      "Incorrect bump argument."
    );
  });

  test("No verify flag", async () => {
    mockConfig(exampleConfig1);
    // await expect(Bump.run(["1.1.1", "--no-verify"]));
  });
});