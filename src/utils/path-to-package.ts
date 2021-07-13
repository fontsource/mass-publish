/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import chalk from "chalk";
import jsonfile from "jsonfile";
import path from "path";
import { format } from "util";

interface PackageJson {
  name: string;
  version: string;
}

const pathToPackage = (dirArray: string[]): PackageJson[] => {
  const packageJsons = dirArray
    .map(dirPath => {
      const packageJsonPath = path.join(dirPath, "package.json");
      try {
        const data: PackageJson = jsonfile.readFileSync(
          path.join(process.cwd(), packageJsonPath)
        );
        return data;
      } catch {
        process.stdout.write(
          `${format(
            chalk.red(
              `${packageJsonPath} may have been removed. Not publishing.`
            )
          )}\n`
        );
      }
    })
    // Remove any undefined items from catch method
    .filter((item): item is PackageJson => !!item);

  return packageJsons;
};

export { pathToPackage };
