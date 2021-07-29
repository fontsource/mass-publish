import { exampleConfig1 } from "../utils/helpers/test-configs";

import { newCommitMessage } from "./commit-message";

test("Commit message", () => {
  const bumpObjects = [
    {
      packageFile: { name: "test1", version: "1.0.0" },
      packagePath: "test",
      bumpedVersion: "1.1.0",
    },
    {
      packageFile: { name: "test2", version: "1.0.0" },
      packagePath: "test",
      bumpedVersion: "2.0.0",
    },
  ];
  const commitMessage = newCommitMessage(exampleConfig1, bumpObjects);

  expect(commitMessage).toBe(
    "chore: release new versions\n- test1@1.1.0\n- test2@2.0.0"
  );
});
