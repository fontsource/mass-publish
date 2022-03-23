// Use path module to ensure tests work with different OS'
import path from "path";
import {
  exampleConfig1,
  exampleConfig2,
  exampleConfig3,
  exampleConfig4,
  exampleConfig5,
} from "../utils/helpers/test-configs";

import { findDiff } from "./find-diff";

describe("Find diff", () => {
  test("Find test package difference #1 - no change", () => {
    return findDiff(exampleConfig1).then(files => {
      return expect(files).toEqual([]);
    });
  });

  test("Find test package differences #2 - all changes", () => {
    return findDiff(exampleConfig2).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test1"),
        path.join("src", "changed", "fixtures", "test2"),
        path.join("src", "changed", "fixtures", "test3"),
      ]);
    });
  });

  test("Find test package differences #3 - test 2 multi subdir", () => {
    return findDiff(exampleConfig3).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test2"),
      ]);
    });
  });

  test("Find test package differences #4 - ignore ts files", () => {
    return findDiff(exampleConfig4).then(files => {
      return expect(files).toEqual([]);
    });
  });

  test("Find test package differences #5 - test 3 remove", () => {
    return findDiff(exampleConfig5).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test1"),
        path.join("src", "changed", "fixtures", "test2"),
        path.join("src", "changed", "fixtures", "test3"),
      ]);
    });
  });

  test("forcepublish flag", async () => {
    // Has random files that needs to be ignored
    const files1 = await findDiff(exampleConfig1, true);
    expect(files1).toEqual(["subdir1"]);

    // Only directories
    const files5 = await findDiff(exampleConfig5, true);
    expect(files5).toEqual(["test1", "test2"]);
  });

  test("Find test package differences #6 - test 3 remove multi packages", () => {
    const exampleConfig = {
      packages: [
        "src/changed/fixtures/test1",
        "src/changed/fixtures/test2",
        "src/changed/fixtures/test3",
      ],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "5059b64905315d7fdc2dcdfcdee51d052945ddf2",
      commitTo: "f1ac53d7aa55ad07fe7df61b5ec810edc49e9fba",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test1"),
        path.join("src", "changed", "fixtures", "test2"),
        path.join("src", "changed", "fixtures", "test3"),
      ]);
    });
});
