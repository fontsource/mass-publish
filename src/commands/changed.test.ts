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
      "--commit-to=7543c880fea5f70fb3ca5ac860be0fda2140e19d",
    ]);
    expect(result).toEqual([
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
    expect(result).toEqual([
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
    expect(result).toEqual([chalk.green.bold("No publish changes detected.")]);
  });

  test("find-diff.test.ts #5 - test 3 remove", async () => {
    await Changed.run([
      "--packages=src/changed/fixtures/",
      "--commit-from=5059b64905315d7fdc2dcdfcdee51d052945ddf2",
      "--commit-to=f1ac53d7aa55ad07fe7df61b5ec810edc49e9fba",
    ]);
    expect(result).toEqual([
      chalk.blue.bold("Packages changed:"),
      chalk.bold("test1"),
      chalk.bold("test2"),
    ]);
  });
});
