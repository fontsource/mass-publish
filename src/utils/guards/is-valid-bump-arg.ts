import semver from "semver";

export const isValidBumpArg = (bumpArg: string): boolean => {
  const validBumpArgs = new Set(["patch", "minor", "major", "from-package"]);

  // If it isn't a bumpArg in the set and isn't a semver version number
  if (!validBumpArgs.has(bumpArg) && !semver.valid(bumpArg)) {
    return false;
  }
  return true;
};
