import chalk from "chalk";
import jsonfile from "jsonfile";
import path from "path";

import { BumpObject } from "./interfaces/bump-object";
import log from "../utils/log";

const writeUpdate = async (item: BumpObject) => {
  const newPackageFile = item.packageFile;
  if (item.bumpedVersion && !item.failedValidation) {
    newPackageFile.version = item.bumpedVersion;

    await jsonfile.writeFile(
      path.join(item.packagePath, "package.json"),
      newPackageFile
    );
  } else {
    log(
      chalk.red(
        `Did not write ${item.packageFile.name} due to failed bump validation.`
      )
    );
  }
};

// Returns an array of promises that need to be resolved
const bumpWrite = (bumpList: BumpObject[]): Promise<void[]> => {
  const promises = [];
  for (const item of bumpList) {
    promises.push(writeUpdate(item));
  }
  return Promise.all(promises);
};

export { bumpWrite };
