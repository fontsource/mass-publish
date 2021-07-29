import { CLIError } from "@oclif/errors";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import parse from "parse-git-config";

import type { Config, Git } from "../changed/changed";

const getGitConfig = async (config: Config): Promise<Git> => {
  if (config.git) {
    return config.git;
  }

  // If not specified in config, try to find author details in OS
  const configPath = path.join(os.homedir(), ".gitconfig");
  try {
    await fs.stat(configPath);
    const gitconfig = await parse({ cwd: "/", path: configPath });
    const author: Git = {
      name: gitconfig?.user.name,
      email: gitconfig?.user.email,
    };
    return author;
  } catch (error) {
    throw new CLIError(
      "Error reading Git config. Try including Git details in mass-publish.json",
      error
    );
  }
};

export { getGitConfig };
