import * as fs from "node:fs/promises";
import path from "path";

import type { Config } from "./interfaces/config";

const readConfig = async (): Promise<Config> => {
  const filePath = path.join(process.cwd(), "mass-publish.json");
  const file = JSON.parse(
    JSON.stringify(await fs.readFile(filePath))
  ) as Config;
  return file;
};

export { readConfig };
