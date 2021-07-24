import { bumpValue } from "./bump-value";
import { pathToPackage } from "../utils/path-to-package";

import { BumpObject } from "./interfaces/bump-object";

const createBumpObject = (diff: string[], bumpArg: string): BumpObject[] => {
  const bumpObjectArr: BumpObject[] = [];
  const packageJsons = pathToPackage(diff);

  diff.forEach((filePath, index) => {
    const bumpedVersion = bumpValue(packageJsons[index].version, bumpArg);
    if (bumpedVersion) {
      const bumpObject: BumpObject = {
        packageFile: packageJsons[index],
        packagePath: filePath,
        bumpedVersion,
      };

      bumpObjectArr.push(bumpObject);
    } else {
      const bumpObject: BumpObject = {
        packageFile: packageJsons[index],
        packagePath: filePath,
        bumpedVersion,
        failedValidation: true,
      };

      bumpObjectArr.push(bumpObject);
    }
  });

  return bumpObjectArr;
};

export { createBumpObject };
