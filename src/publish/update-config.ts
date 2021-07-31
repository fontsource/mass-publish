import execa from "execa";
import jsonfile from "jsonfile";
import path from "path";

import type { Config } from "../changed/changed";

const getHeadCommit = async (): Promise<string> => {
  const { stdout } = await execa("git", ["rev-parse", "HEAD"]);
  return stdout;
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
