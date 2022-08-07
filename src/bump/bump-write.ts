import * as fs from "fs/promises";
import stringify from "json-stringify-pretty-compact";
import path from "path";

import { BumpObject } from "./interfaces/bump-object";

const writeUpdate = async (item: BumpObject) => {
  const newPackageFile = item.packageFile;
  if (item.bumpedVersion && !item.noPublish) {
    newPackageFile.version = item.bumpedVersion;

    await fs.writeFile(
      path.join(item.packagePath, "package.json"),
      stringify(newPackageFile)
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
