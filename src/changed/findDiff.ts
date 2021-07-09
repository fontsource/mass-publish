import { Repository } from "nodegit";
import path from "path";

import { Config } from "./interfaces/config";

const findDiff = async ({
  packages,
  ignoreChanges,
  commitFrom,
  commitTo,
}: Config): Promise<any> => {
  const repo = await Repository.open(path.resolve(process.cwd()));

  // Compare commit from
  const from = await repo.getCommit(commitFrom);
  const fromTree = await from.getTree();

  // Compare commit to
  if (commitTo === undefined) {
    commitTo = await (await repo.getHeadCommit()).sha();
  }

  const to = await repo.getCommit(commitTo);
  const toTree = await to.getTree();

  // Compare both Git trees to and from
  const diff = await toTree.diff(fromTree);
  const patches = await diff.patches();

  const pathArray = [];

  for (const patch of patches) {
    const path = patch.newFile().path();
    pathArray.push(path);
  }
  return pathArray;
};

export { findDiff };
