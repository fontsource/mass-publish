import { Command, flags } from "@oclif/command";
import * as fs from "fs/promises";
import stringify from "json-stringify-pretty-compact";
import path from "path";

import { getHeadCommit } from "../publish/publish";

import type { Config } from "../changed/changed";

export default class Init extends Command {
  static description = "Generates mass-publish.json";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run(): Promise<void> {
    const filePath = path.join(process.cwd(), "mass-publish.json");
    const headCommit = await getHeadCommit();
    const defaultConfig: Config = {
      packages: ["packages/"],
      ignoreExtension: [],
      commitMessage: "chore: release new versions",
      commitFrom: headCommit,
    };
    defaultConfig.commitFrom = headCommit;
    await fs.writeFile(filePath, stringify(defaultConfig));
    this.log("mass-publish.json has been created.");
  }
}
