import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";

import chalk from "chalk";
import { readConfig } from "../changed/read-config";
import { findDiff } from "../changed/find-diff";

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

    // Flags
    let verify = true || config.noVerify;
    if (flags["no-verify"]) verify = false;

    let autoBump = false || config.autoBump;
    if (flags["auto-bump"]) autoBump = true;

    // If there are no packages to publish, no need for confirmation prompt
    let skipPrompt = false || config.yes;
    if (flags.yes) skipPrompt = true;

    /* const bumpedFiles = await bumpList(diff, bumpArg, verify);
    if (bumpedFiles) {
      if (skipPrompt) {
        await bumpPackages(bumpedFiles);
      } else {
        const input = await cli.confirm(`Bump ${bumpedFiles.length} packages?`);
        if (input) {
          await bumpPackages(bumpedFiles);
          cli.log(chalk.green.bold(`Packages bumped!`));
        }
      }
    } */
  }
}
