/* eslint-disable complexity */
import { Command, flags } from "@oclif/command";
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
    if (
      bumpArg !== "patch" ||
      bumpArg !== "minor" ||
      bumpArg !== "major" ||
      semver.valid(bumpArg)
    ) {
      throw new Error("Incorrect bump argument .");
    }

    // Flags
    let verify = true || config.noVerify;
    if (flags["no-verify"]) verify = false;

    let autoBump = false || config.autoBump;
    if (flags["auto-bump"]) autoBump = true;

    // If there are no packages to publish, no need for confirmation prompt
    let skipPrompt = false || config.yes;
    if (flags.yes) skipPrompt = true;

    cli.action.start("Checking packages...");
    const bumpObjects = await createBumpObject(diff, bumpArg);
    const checkedObjects = await bumpCheck(bumpObjects);
    cli.action.stop("Done");

    if (!skipPrompt) {
      const input = await cli.confirm(
        `Bump ${checkedObjects.length} packages?`
      );
      if (!input) {
        throw new Error("Bump cancelled.");
      }
    }

    cli.action.start("Writing updates...");
    await bumpWrite(checkedObjects);
    cli.action.stop("Done");
  }
}
