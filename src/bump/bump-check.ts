import chalk from "chalk";
import PQueue from "p-queue";
import semver from "semver";
import latestVersion from "latest-version";

import { bumpValue } from "./bump-value";
import { log } from "../utils/utils";

import type { BumpObject } from "./bump";

const queue = new PQueue({ concurrency: 12 });

const validate = async (item: BumpObject, autoBump: boolean) => {
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

  // If bumped value is not greater than NPM, auto bump with patch
  const newItem = item;
  if (autoBump) {
    const newVersion = bumpValue(npmVersion, "patch");
    if (newVersion) {
      log(
        chalk.red(
          `${newItem.packageFile.name} version mismatch. NPM version ${npmVersion}. Bump value ${item.bumpedVersion}. Auto-bumping...`
        )
      );
      newItem.bumpedVersion = newVersion;
      return newItem;
    }
  }

  // If failed to bump again, will not publish
  newItem.failedValidation = true;
  log(
    chalk.red(
      `${newItem.packageFile.name} version mismatch. Failed to bump. Not publishing.`
    )
  );
  return newItem;
};

const bumpCheck = async (
  bumpList: BumpObject[],
  autoBump = false
): Promise<BumpObject[]> => {
  const checkedList: Promise<BumpObject>[] = [];

  for (const item of bumpList) {
    const validatedItem = queue.add(() => validate(item, autoBump));
    checkedList.push(validatedItem);
  }

  return Promise.all(checkedList);
};

export { bumpCheck };