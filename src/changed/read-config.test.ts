import { readConfig } from "./read-config";

const exampleConfig = {
  packages: ["packages/"],
  ignoreExtension: [".json", ".md"],
  commitMessage: "chore: release new versions",
};

describe("Read config", () => {
  test("If file loads", () => {
    return readConfig().then(data => {
      return expect(data).toBeDefined();
    });
  });
});
