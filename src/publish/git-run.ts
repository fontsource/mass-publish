import { newCommitMessage } from "./commit-message";
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

  // Update mass-publish.json with new commitFrom hash before pushing
  await updateConfig(config);

  // Stage all files
  await gitAdd();
  const commitMessage = newCommitMessage(config, bumpObjects);

  // Commit
  await gitCommit(commitMessage);

  // Push prep
  const remoteURL = await gitRemoteUrl();
  await gitRemoteAdd(name, remoteURL);

  // Push
  await gitPush();
};

export { gitRun };
