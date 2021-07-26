import { bumpValue } from "./bump-value";
import { pathToPackage } from "../utils/path-to-package";

import { BumpObject } from "./interfaces/bump-object";
import { isPackageJson } from "../utils/interfaces/is-package-json";

const createBumpObject = (diff: string[], bumpArg: string): BumpObject[] => {
  const bumpObjectArr: BumpObject[] = [];
  const packageJsons = pathToPackage(diff);

  let index = 0;
  for (const filePath of diff) {
    const packageJson = packageJsons[index];
    if (isPackageJson(packageJson)) {
      const bumpedVersion = bumpValue(packageJson.version, bumpArg);

      // If bumped version returns false, set failedValidation to true
      const bumpObject: BumpObject = bumpedVersion
        ? {
            packageFile: packageJson,
            packagePath: filePath,
            bumpedVersion,
          }
        : {
            packageFile: packageJson,
            packagePath: filePath,
            bumpedVersion,
            failedValidation: true,
          };

      bumpObjectArr.push(bumpObject);
    }
    index += 1;
  }

  return bumpObjectArr;
};

export { createBumpObject };
