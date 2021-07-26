import { bumpValue } from "./bump-value";

describe("Bump Value", () => {
  test("Patch", () => {
    const newVersion = bumpValue("1.0.0", "patch");
    expect(newVersion).toBe("1.0.1");
  });

  test("Minor", () => {
    const newVersion = bumpValue("1.0.0", "minor");
    expect(newVersion).toBe("1.1.0");
  });

  test("Major", () => {
    const newVersion = bumpValue("1.0.0", "major");
    expect(newVersion).toBe("2.0.0");
  });

  test("Version number", () => {
    const newVersion = bumpValue("1.0.0", "2.5.1");
    expect(newVersion).toBe("2.5.1");
  });

  test("False input version", () => {
    const newVersion = bumpValue("a.b.c", "major");
    expect(newVersion).toBeFalsy();
  });

  test("False bump arg", () => {
    const newVersion = bumpValue("1.0.0", "test");
    expect(newVersion).toBeFalsy();
  });
});
