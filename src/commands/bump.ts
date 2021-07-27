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
    // flag to patch auto-bump a package if version matches NPM version --auto-bump
    "auto-bump": flags.boolean({
      description: "Auto-bump package if specified version is too low",
    }),
    // flag to skip confirmation to write package bumps --yes
    yes: flags.boolean({
      description: "Skip confirmation to write bumped versions to package.json",
    }),

    // Copied over from changed.ts
    // Overrides commitTo value in config --commit-to=
    "commit-to": flags.string({ description: "Compare to commit hash" }),
    // Overrides commitFrom value in config --commit-from=
    "commit-from": flags.string({ description: "Compare from commit hash" }),
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

    const diff = await findDiff(config);
    const bumpObjects = await createBumpObject(diff, bumpArg);

    const bumpFlagVars = bumpFlags(flags);
    const checkedObjects = await bumpCliPrint(bumpFlagVars, bumpObjects);

    cli.action.start(chalk.blue("Writing updates..."));
    await bumpWrite(checkedObjects);
    cli.action.stop(chalk.green("Done."));
  }
}
