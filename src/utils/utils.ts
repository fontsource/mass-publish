import { bumpFlags, changedFlags, publishFlags } from "./flag-config";
import log from "./log";
import { pathToPackage } from "./path-to-package";

import { isPackageJson } from "./guards/is-package-json";
import { isValidBumpArg } from "./guards/is-valid-bump-arg";

import type {
  PackageJson,
  PackageJsonObject,
  Removed,
} from "./interfaces/package-json";
import type {
  Flags,
  FlagsBump,
  FlagsBumpReturn,
  FlagsChanged,
  FlagsPublish,
  FlagsPublishReturn,
} from "./interfaces/flags";

export {
  bumpFlags,
  changedFlags,
  publishFlags,
  log,
  pathToPackage,
  isPackageJson,
  isValidBumpArg,
};
export type {
  PackageJson,
  PackageJsonObject,
  Removed,
  Flags,
  FlagsBump,
  FlagsBumpReturn,
  FlagsChanged,
  FlagsPublish,
  FlagsPublishReturn,
};
