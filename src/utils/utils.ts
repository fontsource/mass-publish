import log from "./log";
import { pathToPackage } from "./path-to-package";

import { isPackageJson } from "./guards/is-package-json";

import type {
  PackageJson,
  PackageJsonObject,
  Removed,
} from "./interfaces/package-json";

export { log, pathToPackage, isPackageJson };
export type { PackageJson, PackageJsonObject, Removed };
