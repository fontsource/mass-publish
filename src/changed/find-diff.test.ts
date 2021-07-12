import { findDiff } from "./find-diff";

describe("Find diff", () => {
  test("Find test package difference #1 - no change", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/test1/", "src/changed/fixtures/test2/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "324088cb56010ce93a595eca2645840203c934b7",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([]);
    });
  });

  test("Find test file differences #2 - all changes", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "c4522ba0b8cb86ea01e680cc739c079ff7df5075",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual(["test1", "test2", "test3"]);
    });
  });

  /* test("Find test file differences #3", () => {
    return findDiff().then(files => {
      expect(files).toBe(["test1", "test2"]);
    });
  });

  test("Find test file differences #4", () => {
    return findDiff().then(files => {
      expect(files).toBe(["test2"]);
    });
  }); */
});
