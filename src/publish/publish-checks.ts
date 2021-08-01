import { CLIError } from "@oclif/errors";
import * as dotenv from "dotenv";

import { gitConfig } from "./git-helpers";

import type { Config } from "../changed/changed";

const publishChecks = async (config: Config): Promise<void> => {
  dotenv.config();

  // Ensure all env variables are loaded
  if (!process.env.GITHUB_TOKEN) {
    throw new CLIError(
      "Missing Github Personal Access Token (GITHUB_TOKEN) in environment! "
    );
  }
  if (!process.env.NPM_AUTH_TOKEN) {
    throw new CLIError("Missing NPM access token! (NPM_AUTH_TOKEN)");
  }

  // Configure Git if specified
  await gitConfig(config);
};

export { publishChecks };
