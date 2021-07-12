import { Command, flags } from "@oclif/command";
import jsonfile from "jsonfile";
import path from "path";

const defaultConfig = {
  packages: ["packages/"],
  ignoreExtension: [],
  commitMessage: "chore: release new versions",
};

export default class Init extends Command {
  static description = "Generates mass-publish.json";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run(): Promise<void> {
    const filePath = path.join(process.cwd(), "mass-publish.json");
    await jsonfile.writeFile(filePath, defaultConfig);
    this.log("mass-publish.json has been created.");
  }
}
