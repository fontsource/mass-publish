import { isPackageJson } from "./is-package-json";
import { PackageJson, Removed } from "../interfaces/package-json";

describe("Is package json type guard", () => {
  test("PackageJson", () => {
    const packageJson: PackageJson = {
      name: "Test",
      version: "1.0.0",
    };
    expect(isPackageJson(packageJson)).toBe(true);
  });

  test("Removed", () => {
    const removed: Removed = {
      removed: true,
    };

    expect(isPackageJson(removed)).toBe(false);
  });
});
