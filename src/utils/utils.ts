import { bumpFlags, changedFlags, publishFlags } from "./flag-config";
import log from "./log";
import { pathToPackage } from "./path-to-package";

import { isPackageJson } from "./guards/is-package-json";

import type {
  PackageJson,
  PackageJsonObject,
  Removed,
} from "./interfaces/package-json";
import type {
  Flags,
  FlagsBump,
  FlagsChanged,
  FlagsPublish,
} from "./interfaces/flags";

export {
  bumpFlags,
  changedFlags,
  publishFlags,
  log,
  pathToPackage,
  isPackageJson,
};
export type {
  PackageJson,
  PackageJsonObject,
  Removed,
  Flags,
  FlagsBump,
  FlagsChanged,
  FlagsPublish,
};
