/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import chalk from "chalk";
import jsonfile from "jsonfile";
import path from "path";
import { format } from "util";

const pathToPackage = (dirArray: string[]): string[] => {
  const packageJsonNames = dirArray
    .map(dirPath => {
      const packageJsonPath = path.join(dirPath, "package.json");
      try {
        const data = jsonfile.readFileSync(
          path.join(process.cwd(), packageJsonPath)
        );
        return data.name as string;
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
    .filter((item): item is string => !!item);

  return packageJsonNames;
};

export { pathToPackage };
