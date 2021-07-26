/* eslint-disable complexity */
import { Command, flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import { cli } from "cli-ux";
import chalk from "chalk";
import semver from "semver";

import { readConfig, findDiff } from "../changed/changed";
import { bumpCheck, createBumpObject, bumpWrite } from "../bump/bump";

export default class Bump extends Command {
  static description = "Bumps package versions";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag to skip checking with NPM registry on version number --no-verify
    "no-verify": flags.boolean({
      description: "Skip checking NPM registry for conflicting versions",
    }),
    // flag to patch auto-bump a package if version matches NPM version --auto-bump
    "auto-bump": flags.boolean({
      description: "Auto-bump package if specified version is too low",
    }),
    // flag to skip confirmation to write package bumps --yes
    yes: flags.boolean({
      description: "Skip confirmation to write bumped versions to package.json",
    }),
  };

  static args = [{ name: "version" }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(Bump);

    const config = await readConfig();
    const diff = await findDiff(config);

    // Args
    const bumpArg = args.version;
    const validBumpArgs = new Set(["patch", "minor", "major"]);

    // If it isn't a bumpArg in the set or isn't a semver version number
    if (!validBumpArgs.has(bumpArg) && !semver.valid(bumpArg)) {
      throw new CLIError("Incorrect bump argument.");
    }

    // Flags
    let noVerify = false;
    if (flags["no-verify"]) {
      noVerify = true;
    }

    let autoBump = false;
    if (flags["auto-bump"]) {
      autoBump = true;
    }

    // If there are no packages to publish, no need for confirmation prompt
    let skipPrompt = false;
    if (flags.yes) {
      skipPrompt = true;
    }

    cli.action.start(chalk.bold.blue("Checking packages..."));
    const bumpObjects = await createBumpObject(diff, bumpArg);

    // Skip checking if no verify flag
    const checkedObjects = noVerify
      ? bumpObjects
      : await bumpCheck(bumpObjects, autoBump);

    if (checkedObjects.length === 0) {
      throw new CLIError("No packages to update found.");
    }
    cli.action.stop(chalk.bold.green("Done."));

    this.log(chalk.bold.blue("Changed packages:"));
    for (const bumpObject of checkedObjects) {
      this.log(
        chalk.magenta(
          `${bumpObject.packageFile.name}: ${bumpObject.packageFile.version} --> ${bumpObject.bumpedVersion}`
        )
      );
    }

    if (!skipPrompt) {
      const input = await cli.confirm(
        chalk.bold.green(`Bump ${checkedObjects.length} packages?`)
      );
      if (!input) {
        throw new CLIError("Bump cancelled.");
      }
    }

    cli.action.start(chalk.blue("Writing updates..."));
    await bumpWrite(checkedObjects);
    cli.action.stop(chalk.green("Done."));
  }
}
