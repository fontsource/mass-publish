import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import PQueue from "p-queue";
import semver from "semver";
import latestVersion from "latest-version";

import type { BumpObject } from "./bump";

const queue = new PQueue({ concurrency: 12 });

const validate = async (item: BumpObject, bumpArg: string) => {
  let npmVersion: string | boolean;
  try {
    // Get latest version from NPM registry and compare if bumped version is greater than NPM
    npmVersion = await latestVersion(item.packageFile.name);
    if (semver.gt(item.bumpedVersion as string, npmVersion)) {
      return item;
    }
  } catch {
    // Assume package isn't published on NPM yet
    return item;
  }

  // If failed, do not publish
  const newItem = item;
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
