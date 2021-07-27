import semver from "semver";

const bumpValue = (oldVersion: string, bumpArg: string): string | false => {
  // Check if valid semver version and if invalid return false
  const arr = semver.valid(oldVersion)?.split(".");
  if (arr) {
    if (bumpArg === "patch") {
      const newNum = Number(arr[2]) + 1;
      arr[2] = String(newNum);
      return arr.join(".");
    }
    if (bumpArg === "minor") {
      const newNum = Number(arr[1]) + 1;
      arr[1] = String(newNum);
      return arr.join(".");
    }
    if (bumpArg === "major") {
      const newNum = Number(arr[0]) + 1;
      arr[0] = String(newNum);
      return arr.join(".");
    }
    if (bumpArg === "from-package") {
      return arr.join(".");
    }
    // Else just return number version
    if (semver.valid(bumpArg)) {
      return bumpArg;
    }

    return false;
  }
  return false;
};

export { bumpValue };
