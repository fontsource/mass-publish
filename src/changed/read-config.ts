import jsonfile from "jsonfile";
import path from "path";

import type { Config } from "./interfaces/config";

const readConfig = async (): Promise<Config> => {
  const filePath = path.join(process.cwd(), "mass-publish.json");
  const file = (await jsonfile.readFile(filePath)) as Config;
  return file;
};

export { readConfig };
