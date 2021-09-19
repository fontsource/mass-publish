import { commitHashUpdateMessage, newCommitMessage } from "./commit-message";
import { getGitConfig } from "./git-config";
import {
  gitAdd,
  gitCommit,
  gitPush,
  gitRemoteAdd,
  gitRemoteUrl,
} from "./git-helpers";
import { updateConfig } from "./update-config";

import type { Config } from "../changed/changed";
import type { BumpObject } from "../bump/bump";

const gitRun = async (
  config: Config,
  bumpObjects: BumpObject[]
): Promise<void> => {
  // Ensure all variables are ready before running git commands
  const { name } = await getGitConfig(config);

  // Stage all files
  await gitAdd();

  // Commit
  const updateMessage = commitHashUpdateMessage(config);
  await gitCommit(updateMessage);

  // Update mass-publish.json with new commitFrom hash
  await updateConfig(config);
  const commitMessage = newCommitMessage(config, bumpObjects);
  await gitCommit(commitMessage);

  // Push prep
  const remoteURL = await gitRemoteUrl();
  await gitRemoteAdd(name, remoteURL);

  // Push
  await gitPush();
};

export { gitRun };
