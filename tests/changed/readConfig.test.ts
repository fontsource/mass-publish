import { isEqual } from "lodash";

import { config } from "../../src/changed/readConfig";

const exampleConfig = {
  packages: ["packages/*"],
  ignoreChanges: ["*.json", "*.md"],
  commitMessage: "chore: release new versions",
};

describe("Read config", () => {
  test("If file loads", () => {
    return config().then(data => {
      const compare = isEqual(data, exampleConfig);

      expect(compare).toBe(true);
    });
  });
});
