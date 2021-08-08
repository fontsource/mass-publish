import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import PQueue from "p-queue";
import semver from "semver";
import latestVersion from "latest-version";

import type { BumpObject } from "./bump";

const queue = new PQueue({ concurrency: 12 });

const validate = async (item: BumpObject, bumpArg: string) => {
  let npmVersion: string | boolean;
  const newItem = item;

  try {
    // Get latest version from NPM registry and compare if bumped version is greater than NPM
    npmVersion = await latestVersion(item.packageFile.name);
    if (semver.gt(item.bumpedVersion as string, npmVersion)) {
      return item;
    }
  } catch (error) {
    // If package isn't published on NPM yet, revert bump
    if (error.name === "PackageNotFoundError") {
      newItem.bumpedVersion = newItem.packageFile.version;
    }

    return newItem;
  }

  // If failed, do not publish

  newItem.noPublish = true;
  if (bumpArg === "from-package") {
    return newItem;
  }

  throw new CLIError(
    chalk.red(
      `${newItem.packageFile.name} version mismatch. Not publishing.\n- NPM: ${npmVersion}\n- Bumped version: ${item.bumpedVersion}`
    )
  );
};

const bumpCheck = async (
  bumpList: BumpObject[],
  bumpArg: string
): Promise<BumpObject[]> => {
  const checkedList: Promise<BumpObject>[] = [];

  for (const item of bumpList) {
    const validatedItem = queue.add(() => validate(item, bumpArg));
    checkedList.push(validatedItem);
  }

  return Promise.all(checkedList);
};

export { bumpCheck };
