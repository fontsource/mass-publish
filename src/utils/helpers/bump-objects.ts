import { findDiff } from "../../changed/changed";
import { createBumpObject } from "../../bump/bump";

import type { Config } from "../../changed/changed";
import type { BumpObject } from "../../bump/bump";

const testBumpObjects = async (
  config: Config,
  bumpArg: string
): Promise<BumpObject[]> => {
  const diff = await findDiff(config); // ?
  return createBumpObject(diff, bumpArg); // ?
};

export { testBumpObjects };
