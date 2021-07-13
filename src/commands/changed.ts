import { Command, flags } from "@oclif/command";
import chalk from "chalk";

import { findDiff } from "../changed/find-diff";
import { pathToPackage } from "../utils/path-to-package";
import { readConfig } from "../changed/read-config";

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
    // Override commit message --commit-message=
    "commit-message": flags.string({ description: "Add commit message" }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(Changed);

    const config = await readConfig();

    // If there are any flags, override respective config
    if (flags["commit-to"]) config.commitTo = flags["commit-to"];
    if (flags["commit-from"]) config.commitFrom = flags["commit-from"];
    if (flags["ignore-extension"]) {
      // Need to convert from string to array e.g. .js,.md -> [".js", ".md"]
      const array = flags["ignore-extension"].split(",");
      config.ignoreExtension = array;
    }
    if (flags.packages) {
      const array = flags.packages.split(",");
      config.packages = array;
    }
    if (flags["commit-message"]) config.commitMessage = flags["commit-message"];

    const diff = await findDiff(config);
    const packageJsons = pathToPackage(diff);
    if (packageJsons.length === 0) {
      this.log(chalk.green.bold("No publish changes detected."));
    } else {
      this.log(chalk.blue.bold("Packages changed:"));
      for (const packageJson of packageJsons) {
        this.log(chalk.bold(packageJson.name));
      }
    }
  }
}
