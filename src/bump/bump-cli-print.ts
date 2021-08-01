import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import { cli } from "cli-ux";
import { log } from "../utils/utils";

import { bumpCheck } from "./bump-check";

import type { BumpObject } from "./bump";
import type { FlagsBumpReturn } from "../utils/utils";

const bumpCliPrint = async (
  bumpFlagVar: FlagsBumpReturn,
  bumpObjects: BumpObject[],
  bumpArg: string
): Promise<BumpObject[]> => {
  // Skip checking if no verify flag
  let checkedObjects: BumpObject[];
  if (bumpFlagVar.noVerify) {
    log(chalk.red("Skipping version verification due to noVerify flag..."));
    checkedObjects = bumpObjects;
  } else {
    checkedObjects = await bumpCheck(bumpObjects, bumpArg);
  }

  if (checkedObjects.length === 0) {
    throw new CLIError("No packages to update found.");
  }
  cli.action.stop(chalk.bold.green("Done."));

  log(chalk.bold.blue("Changed packages:"));
  for (const bumpObject of checkedObjects) {
    log(
      chalk.magenta(
        `${bumpObject.packageFile.name}: ${bumpObject.packageFile.version} --> ${bumpObject.bumpedVersion}`
      )
    );
  }

  if (!bumpFlagVar.skipPrompt) {
    // Filter out any objects with the noPublish flag attached to them
    const publishObjects = checkedObjects.filter(
      bumpObject => !bumpObject.noPublish
    );
    const input = await cli.confirm(
      chalk.bold.green(`Bump ${publishObjects.length} packages?`)
    );
    if (!input) {
      throw new CLIError("Bump cancelled.");
    }
  }

  return checkedObjects;
};

export { bumpCliPrint };
