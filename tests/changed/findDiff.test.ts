import { findDiff } from "../../src/changed/findDiff";

describe("Find diff", () => {
  test("Find test package difference #1 - no change", () => {
    const exampleConfig = {
      packages: ["tests/changed/fixtures/*"],
      ignoreChanges: [],
      commitMessage: "chore: release new versions",
      commitFrom: "324088cb56010ce93a595eca2645840203c934b7",
    };

    return findDiff(exampleConfig).then(files => {
      expect(files).toEqual([]);
    });
  });

  /*test("Find test file differences #2", () => {
    return findDiff().then(files => {
      expect(files).toBe(["test1"]);
    });
  });

  test("Find test file differences #3", () => {
    return findDiff().then(files => {
      expect(files).toBe(["test1", "test2"]);
    });
  });

  test("Find test file differences #4", () => {
    return findDiff().then(files => {
      expect(files).toBe(["test2"]);
    });
  });*/
});
