import type {
  BumpFlags,
  FlagsBump,
  FlagsChanged,
  FlagsPublish,
} from "./interfaces/flags";
import type { Config } from "../changed/changed";

const changedFlags = (flags: Partial<FlagsChanged>, config: Config): Config => {
  const newConfig = config;
  if (flags["commit-to"]) {
    newConfig.commitTo = flags["commit-to"];
  }
  if (flags["commit-from"]) {
    newConfig.commitFrom = flags["commit-from"];
  }
  if (flags["ignore-extension"]) {
    // Need to convert from string to array e.g. .js,.md -> [".js", ".md"]
    const array = flags["ignore-extension"].split(",");
    newConfig.ignoreExtension = array;
  }
  if (flags.packages) {
    const array = flags.packages.split(",");
    newConfig.packages = array;
  }

  return newConfig;
};

const bumpFlags = (flags: Partial<FlagsBump>): BumpFlags => {
  // Flags
  let noVerify = false;
  if (flags["no-verify"]) {
    noVerify = true;
  }

  let autoBump = false;
  if (flags["auto-bump"]) {
    autoBump = true;
  }

  // If there are no packages to publish, no need for confirmation prompt
  let skipPrompt = false;
  if (flags.yes) {
    skipPrompt = true;
  }
  return { noVerify, autoBump, skipPrompt };
};

const publishFlags = (flags: Partial<FlagsPublish>): boolean => {
  let forcePublish = false;
  if (flags["force-publish"]) {
    forcePublish = true;
  }
  return forcePublish;
};

export { changedFlags, bumpFlags, publishFlags };
