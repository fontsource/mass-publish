import chalk from "chalk";
import jsonfile from "jsonfile";
import path from "path";

import { pathToPackage } from "./path-to-package";

describe("Path to package", () => {
  afterEach(() => jest.restoreAllMocks());

  test("Successful read", () => {
    jest.spyOn(jsonfile, "readFileSync").mockImplementation(() => {
      return { name: "Test Package" };
    });

    const names = pathToPackage([path.join("src", "test")]);
    expect(names[0]).toEqual({ name: "Test Package" });
  });

  test("Unsuccessful read", () => {
    const result: any = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => result.push(String(val).trim()));

    const names = pathToPackage([path.join("src", "test")]);
    expect(names).toEqual([{ removed: true }]);
    expect(result).toEqual([
      chalk.red(
        `${path.join(
          "src",
          "test",
          "package.json"
        )} may have been removed. Not publishing.`
      ),
    ]);
  });
});
