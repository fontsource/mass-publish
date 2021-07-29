import { promises as fs } from "fs";
import { resolveRef } from "isomorphic-git";
import jsonfile from "jsonfile";
import path from "path";

import type { Config } from "../changed/changed";

const getHeadCommit = async (): Promise<string> => {
  try {
    const commit = await resolveRef({ fs, dir: process.cwd(), ref: "HEAD" });
    return commit;
  } catch {
    throw new Error("Unable to get HEAD commit to update config.");
  }
};

const updateConfig = async (config: Config): Promise<void> => {
  const headCommit = await getHeadCommit();

  // Update commitFrom with HEAD commit
  const newConfig = config;
  newConfig.commitFrom = headCommit;

  const configPath = path.join(process.cwd(), "mass-publish.json");
  await jsonfile.writeFile(configPath, newConfig);
};

export { getHeadCommit, updateConfig };
