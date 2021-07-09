import jsonfile from "jsonfile";
import path from "path";

import { Config } from "./interfaces/config";

const config = async (): Promise<Config> => {
  const filePath = path.join(process.cwd(), "mass-publish.json");
  const file = await jsonfile.readFile(filePath);
  return file;
};

export { config };
