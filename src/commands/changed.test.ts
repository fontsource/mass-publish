import chalk from "chalk";
import { cli } from "cli-ux";
import path from "path";

import Changed from "./changed";

jest.setTimeout(50_000);

describe("Changed command", () => {
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
  });

  afterEach(() => jest.restoreAllMocks());

  test("find-diff.test.ts #1 - no changes", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/test1/,src/changed/fixtures/test2/",
      "--commit-from=324088cb56010ce93a595eca2645840203c934b7",
    ]);
    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.red(
        `${path.join(
          "src",
          "changed",
          "fixtures",
          "test2",
          "subdir1",
          "package.json"
        )} may have been removed. Not publishing.`
      ),
      chalk.green.bold("No publish changes detected."),
    ]);
  });

  test("find-diff.test.ts #2 - all changes", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--commit-from=d08dd26bd63748ac7961f45d3bf46f7ef42f41d1",
      "--commit-to=7543c880fea5f70fb3ca5ac860be0fda2140e19d",
    ]);
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
      chalk.blue.bold("Packages changed:"),
      chalk.bold("test1"),
      chalk.bold("test2"),
    ]);
  });

  test("find-diff.test.ts #3 - test 2 multi subdir", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--commit-from=7543c880fea5f70fb3ca5ac860be0fda2140e19d",
      "--commit-to=5059b64905315d7fdc2dcdfcdee51d052945ddf2",
    ]);
    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.blue.bold("Packages changed:"),
      chalk.bold("test2"),
    ]);
  });

  test("find-diff.test.ts #4 - ignore ts files", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--ignore-extension=.ts",
      "--commit-from=7543c880fea5f70fb3ca5ac860be0fda2140e19d",
      "--commit-to=5059b64905315d7fdc2dcdfcdee51d052945ddf2",
    ]);
    expect(results).toEqual([
      chalk.bold.blue("Checking packages..."),
      chalk.green.bold("No publish changes detected."),
    ]);
  });

  test("find-diff.test.ts #5 - test 3 remove, 2 package change", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--commit-from=5059b64905315d7fdc2dcdfcdee51d052945ddf2",
      "--commit-to=f1ac53d7aa55ad07fe7df61b5ec810edc49e9fba",
    ]);
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
      chalk.blue.bold("Packages changed:"),
      chalk.bold("test1"),
      chalk.bold("test2"),
    ]);
  });
});
