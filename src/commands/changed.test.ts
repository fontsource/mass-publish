import chalk from "chalk";
import Changed from "./changed";

describe("Changed command", () => {
  let result: any;

  beforeEach(() => {
    result = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => result.push(String(val).trim()));
  });

  afterEach(() => jest.restoreAllMocks());

  test("find-diff.test.ts #1 - no changes", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/test1/,src/changed/fixtures/test2/",
      "--commit-from=324088cb56010ce93a595eca2645840203c934b7",
    ]);
    expect(result).toEqual([chalk.green.bold("No publish changes detected.")]);
  });

  test("find-diff.test.ts #2 - all changes", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--commit-from=d08dd26bd63748ac7961f45d3bf46f7ef42f41d1",
    ]);
    expect(result).toEqual([
      chalk.blue.bold("Packages changed:"),
      chalk.bold("test1"),
      chalk.bold("test2"),
      chalk.bold("test3"),
    ]);
  });
});
