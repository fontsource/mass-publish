import jsonfile from "jsonfile";
import path from "path";

import { BumpObject } from "./interfaces/bump-object";

const writeUpdate = async (item: BumpObject) => {
  const newPackageFile = item.packageFile;
  if (item.bumpedVersion && !item.noPublish) {
    newPackageFile.version = item.bumpedVersion;

    await jsonfile.writeFile(
      path.join(item.packagePath, "package.json"),
      newPackageFile
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
