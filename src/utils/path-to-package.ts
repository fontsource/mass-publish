/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import chalk from "chalk";
import jsonfile from "jsonfile";
import path from "path";

import log from "./log";

import { PackageJson, PackageJsonObject } from "./interfaces/package-json";

const pathToPackage = (dirArray: string[]): PackageJsonObject[] => {
  const packageJsons = dirArray.map(dirPath => {
    const packageJsonPath = path.join(dirPath, "package.json");
    try {
      const data: PackageJson = jsonfile.readFileSync(
        path.join(process.cwd(), packageJsonPath)
      );
      return data;
    } catch {
      log(
        chalk.red(`${packageJsonPath} may have been removed. Not publishing.`)
      );
      return {
        removed: true,
      };
    }
  });

  return packageJsons;
};

export { pathToPackage };
