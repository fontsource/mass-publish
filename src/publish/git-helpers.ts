import execa from "execa";

import type { Config } from "../changed/changed";

const gitAdd = async (): Promise<void> => {
  await execa("git", ["add", "--all"]);
};

const gitConfig = async (config: Config): Promise<void> => {
  if (config.git?.name && config.git?.email) {
    await execa("git", [
      "config",
      "--global",
      "user.name",
      `"${config.git.name}"`,
    ]);
    await execa("git", [
      "config",
      "--global",
      "user.email",
      `"${config.git.email}"`,
    ]);
  }
};

const gitCommit = async (message: string): Promise<void> => {
  await execa("git", ["commit", "-m", `"${message}"`]);
};

const gitRemoteUrl = async (): Promise<string> => {
  const remoteURL = await execa("git", [
    "config",
    "--get",
    "remote.origin.url",
  ]);
  // Strip https:// from remote link get
  const strippedURL = new URL(remoteURL.stdout).host;
  return strippedURL;
};

const gitRemoteAdd = async (
  name: string,
  strippedURL: string
): Promise<void> => {
  // git remote add origin https://username:access-token@github.com/username/repo.git
  const publishURL = `https://${name}:${process.env.GITHUB_TOKEN}@${strippedURL}`;
  try {
    await execa("git", ["remote", "add", "origin", publishURL]);
  } catch {
    // Git origin already exists. Continue
  }
};

const gitPush = async (): Promise<void> => {
  await execa("git", ["push", "origin", "main"]);
};

export { gitAdd, gitConfig, gitCommit, gitRemoteAdd, gitRemoteUrl, gitPush };
