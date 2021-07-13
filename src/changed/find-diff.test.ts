// Use path module to ensure tests work with different OS'
import path from "path";

import { findDiff } from "./find-diff";

describe("Find diff", () => {
  test("Find test package difference #1 - no change", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/test1/", "src/changed/fixtures/test2/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "324088cb56010ce93a595eca2645840203c934b7",
      commitTo: "9b6fc2119d093ae5605f8725c6d7a70e9be291b1",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([]);
    });
  });

  test("Find test package differences #2 - all changes", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "d08dd26bd63748ac7961f45d3bf46f7ef42f41d1",
      commitTo: "7543c880fea5f70fb3ca5ac860be0fda2140e19d",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test1"),
        path.join("src", "changed", "fixtures", "test2"),
        path.join("src", "changed", "fixtures", "test3"),
      ]);
    });
  });

  test("Find test package differences #3 - test 2 multi subdir", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: "7543c880fea5f70fb3ca5ac860be0fda2140e19d",
      commitTo: "5059b64905315d7fdc2dcdfcdee51d052945ddf2",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([
        path.join("src", "changed", "fixtures", "test2"),
      ]);
    });
  });

  test("Find test package differences #4 - ignore ts files", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/"],
      ignoreExtension: [".ts"],
      commitMessage: "chore: release new versions",
      commitFrom: "7543c880fea5f70fb3ca5ac860be0fda2140e19d",
      commitTo: "5059b64905315d7fdc2dcdfcdee51d052945ddf2",
    };

    return findDiff(exampleConfig).then(files => {
      return expect(files).toEqual([]);
    });
  });

  test("Find test package differences #5 - test 3 remove", () => {
    const exampleConfig = {
      packages: ["src/changed/fixtures/"],
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
});
