/* eslint-disable complexity */
import { Command, flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import { cli } from "cli-ux";
import chalk from "chalk";

import { bumpCliPrint, bumpWrite, createBumpObject } from "../bump/bump";
import { readConfig, findDiff } from "../changed/changed";
import { bumpFlags, changedFlags, isValidBumpArg } from "../utils/utils";

export default class Bump extends Command {
  static description = "Bumps package versions";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag to skip checking with NPM registry on version number --no-verify
    "no-verify": flags.boolean({
      description: "Skip checking NPM registry for conflicting versions",
    }),
    // flag to skip confirmation to write package bumps --yes
    yes: flags.boolean({
      description: "Skip confirmation to write bumped versions to package.json",
    }),
    // Force publish all packages including those not changed --force-publish
    "force-publish": flags.boolean({
      description: "Force publish all packages even if no changes detected",
    }),

    // Copied over from changed.ts
    // Overrides commitTo value in config --commit-to=
    "commit-to": flags.string({ description: "Compare to commit hash" }),
    // Overrides commitFrom value in config --commit-from=
    "commit-from": flags.string({ description: "Compare from commit hash" }),
    // Overrides commitMessage value in config --commit-message=
    "commit-message": flags.string({ description: "Commit message" }),
    // Overrides ignoreExtension values in config --ignore-changes=.js,.md
    "ignore-extension": flags.string({ description: "Ignore file extensions" }),
    // Overrides packages value in config --packages=./packages,./other-packages
    packages: flags.string({
      description: "Directories for packages to be checked",
    }),
  };

  static args = [{ name: "version" }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(Bump);

    // Args
    const bumpArg = args.version;
    if (!isValidBumpArg(bumpArg)) {
      throw new CLIError("Incorrect bump argument.");
    }

    cli.action.start(chalk.bold.blue("Checking packages..."));
    let config = await readConfig();
    // If there are any flags, override respective config
    config = changedFlags(flags, config);

    const bumpFlagVars = bumpFlags(flags);
    const diff = await findDiff(config, bumpFlagVars.forcePublish);
    const bumpObjects = await createBumpObject(diff, bumpArg);

    const checkedObjects = await bumpCliPrint(
      bumpFlagVars,
      bumpObjects,
      bumpArg
    );

    cli.action.start(chalk.blue("Writing updates..."));
    await bumpWrite(checkedObjects);
    cli.action.stop(chalk.green("Done."));
  }
}
