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

jest.setTimeout(50_000);

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
});
