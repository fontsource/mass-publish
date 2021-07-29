import { readConfig } from "./read-config";
import { findDiff } from "./find-diff";

import type { Config, Git } from "./interfaces/config";
import type { GitWalk } from "./interfaces/git-walk";

export { findDiff, readConfig };
export type { Config, Git, GitWalk };
