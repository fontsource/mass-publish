import { mocked } from "ts-jest/utils";
import { createBumpObject } from "./create-bump";
import { pathToPackage } from "../utils/path-to-package";

jest.mock("../utils/path-to-package");

describe("Create bump object", () => {
  test("Success", () => {
    const mockedPathPackage = mocked(pathToPackage);
    mockedPathPackage.mockReturnValue([
      { name: "test-1", version: "1.0.0" },
      { name: "test-2", version: "1.1.1" },
    ]);

    const diffExample = ["packages/test-1", "packages/test-2"];
    const result = createBumpObject(diffExample, "patch");

    const validResult = [
      {
        packageFile: { name: "test-1", version: "1.0.0" },
        packagePath: "packages/test-1",
        bumpedVersion: "1.0.1",
      },
      {
        packageFile: { name: "test-2", version: "1.1.1" },
        packagePath: "packages/test-2",
        bumpedVersion: "1.1.2",
      },
    ];

    expect(result).toEqual(validResult);
  });
});
