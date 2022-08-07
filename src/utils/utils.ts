export { bumpFlags, changedFlags } from "./flag-config";
export { isPackageJson } from "./guards/is-package-json";
export { isValidBumpArg } from "./guards/is-valid-bump-arg";
export { Flags, FlagsBump, FlagsBumpReturn, FlagsChanged } from "./interfaces/flags";
export { PackageJson, PackageJsonObject, Removed } from "./interfaces/package-json";
export { default as log } from "./log";
export { pathToPackage } from "./path-to-package";