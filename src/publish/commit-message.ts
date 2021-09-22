import type { Config } from "../changed/changed";
import type { BumpObject } from "../bump/bump";

const newCommitMessage = (
  config: Config,
  bumpObjects: BumpObject[]
): string => {
  let { commitMessage } = config;

  for (const bumpObject of bumpObjects) {
    commitMessage += `\n- ${bumpObject.packageFile.name}@${bumpObject.bumpedVersion}`;
  }
  return commitMessage;
};

const commitHashUpdateMessage = (config: Config): string => {
  let message = "chore(build): update packages";
  const { updateMessage } = config;
  if (updateMessage) {
    message = updateMessage;
  }

  return message;
};

export { newCommitMessage, commitHashUpdateMessage };
