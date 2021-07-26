import { Command, flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import { cli } from "cli-ux";

import { readConfig, findDiff } from "../changed/changed";
import { pathToPackage, isPackageJson } from "../utils/utils";

export default class Changed extends Command {
  static description = "Detects what packages have changed since last publish";

  static flags = {
    help: flags.help({ char: "h" }),
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

  async run(): Promise<void> {
    const { flags } = this.parse(Changed);

    cli.action.start(chalk.bold.blue("Checking packages..."));
    const config = await readConfig();

    // If there are any flags, override respective config
    if (flags["commit-to"]) {
      config.commitTo = flags["commit-to"];
    }
    if (flags["commit-from"]) {
      config.commitFrom = flags["commit-from"];
    }
    if (flags["ignore-extension"]) {
      // Need to convert from string to array e.g. .js,.md -> [".js", ".md"]
      const array = flags["ignore-extension"].split(",");
      config.ignoreExtension = array;
    }
    if (flags.packages) {
      const array = flags.packages.split(",");
      config.packages = array;
    }

    const diff = await findDiff(config);

    // Filter out all removed: true, packages.
    const packageJsons = pathToPackage(diff).filter(packageJson =>
      isPackageJson(packageJson)
    );

    if (packageJsons.length === 0) {
      cli.action.stop(chalk.green.bold("No publish changes detected."));
    } else {
      cli.action.stop(chalk.blue.bold("Packages changed:"));
      for (const packageJson of packageJsons) {
        // Typescript can't detect type guard through filter earlier
        if (isPackageJson(packageJson)) {
          this.log(chalk.bold(packageJson.name));
        } else {
          // Theoretically should never throw...
          throw new CLIError(`Unknown object: ${packageJson}`);
        }
      }
    }
  }
}
