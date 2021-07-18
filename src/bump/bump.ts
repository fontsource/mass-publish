import async from "async";
import chalk from "chalk";
import latestVersion from "latest-version";
import path from "path";
import jsonfile from "jsonfile";
import semver from "semver";

import log from "../utils/log";
import { pathToPackage } from "../utils/path-to-package";

import { PackageJson } from "../utils/interfaces/package-json";
import { QueueObject } from "./interfaces/queue-object";
import { BumpObject } from "./interfaces/bump-object";

const processQueue = async ({
  packagePath,
  packageFile,
  bumpArg,
  verify,
}: QueueObject) => {
  let npmVersion: string | false;
  // Get latest version from NPM registry
  try {
    npmVersion = await latestVersion(packageFile.name);
  } catch {
    // Assume package isn't published
    npmVersion = false;
  }

  // Bump current package.json
  const currentVersion = packageFile.version;
  const bumpedVersion = bumpValue(currentVersion, bumpArg);

  if (bumpedVersion && npmVersion) {
    // Compare if bumped version is greater than version on NPM
    if (semver.gt(bumpedVersion, npmVersion)) {
      await writeUpdate(packageFile, packagePath, bumpedVersion);
    } else {
      // Try bumping one more time this time
      const newBumpedVersion = bumpValue(bumpedVersion, "patch");
      if (newBumpedVersion && semver.gt(newBumpedVersion, npmVersion)) {
        await writeUpdate(packageFile, packagePath, newBumpedVersion);
      } else {
        log(
          chalk.red(
            `${packageFile.name} failed to bump. Specified bump version is less than NPM version.`
          )
        );
      }
    }
  } else {
    log(
      chalk.red(
        `${packageFile.name} failed to bump. Possible failure due to bump value or incompatible existing package.json value.`
      )
    );
  }
};
