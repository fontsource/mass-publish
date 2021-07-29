import * as dotenv from "dotenv";
import { promises as fs } from "fs";
import { statusMatrix, add, remove, commit, push } from "isomorphic-git";
import http from "isomorphic-git/http/node";

import { newCommitMessage } from "./commit-message";
import { getGitConfig } from "./git-config";
import { updateConfig } from "./update-config";

import type { Config } from "../changed/changed";
import type { BumpObject } from "../bump/bump";

const gitCommit = async (
  config: Config,
  bumpObjects: BumpObject[]
): Promise<void> => {
  dotenv.config();
  const dir = process.cwd();
  const repo = { fs, dir };

  // Update mass-publish.json with new commitFrom hash before pushing
  await updateConfig(config);

  // git add -A
  await statusMatrix(repo).then(status =>
    Promise.all(
      status.map(([filepath, , worktreeStatus]) =>
        worktreeStatus
          ? add({ ...repo, filepath })
          : remove({ ...repo, filepath })
      )
    )
  );

  // Gets git author details for commit
  const { name, email } = await getGitConfig(config);
  const commitMessage = newCommitMessage(config, bumpObjects);

  // Commit
  const sha = await commit({
    fs,
    dir,
    message: config.commitMessage,
    author: {
      name,
      email,
    },
  });

  // Push
  const pushResult = await push({
    fs,
    http,
    dir,
    onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
  });
};

export { gitCommit };
