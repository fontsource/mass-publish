import { Command, flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";

import { bumpCliPrint, bumpWrite, createBumpObject } from "../bump/bump";
import { readConfig, findDiff } from "../changed/changed";
import {
  changedFlags,
  bumpFlags,
  publishFlags,
  isValidBumpArg,
} from "../utils/utils";

export default class Changed extends Command {
  static description = "Publishes changed packages";

  static flags = {
    help: flags.help({ char: "h" }),
    // Force publish all packages including those not changed --force-publish
    "force-publish": flags.boolean({
      description: "Force publish all packages even if no changes detected",
    }),
    // Copied over from bump.ts
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
    const { args, flags } = this.parse(Changed);

    // Args
    const bumpArg = args.version;
    if (!isValidBumpArg(bumpArg)) {
      throw new CLIError("Incorrect bump argument.");
    }

    let config = await readConfig();
    // If there are any flags, override respective config
    config = changedFlags(flags, config);

    const diff = await findDiff(config);
    const bumpObjects = await createBumpObject(diff, bumpArg);

    const bumpFlagVars = bumpFlags(flags);
    const checkedObjects = await bumpCliPrint(bumpFlagVars, bumpObjects);
    await bumpWrite(checkedObjects);

    const { forcePublish } = publishFlags(flags);
  }
}
