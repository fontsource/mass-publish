import { Repository } from "nodegit";
import path from "path";

import { Config } from "./interfaces/config";

const findDiff = async ({
  packages,
  ignoreExtension = [],
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

  // Removes all diffs that do not match the configuration
  const filteredPathArray = pathArray.filter(path => {
    let match = false;

    for (const packagePath of packages) {
      // Only allow paths that match config.packages
      if (path.startsWith(packagePath)) {
        match = true;
      }

      // Reject any that match config.ignoreExtension
      for (const matchingExtension of ignoreExtension) {
        if (path.endsWith(matchingExtension)) {
          match = false;
        }
      }
    }

    return match;
  });

  // Only return changed directories with package.json
  // tests/fixtures/test1/package.json --> test1
  const packageJsonPaths = filteredPathArray
    .filter(path => {
      if (path.endsWith("package.json")) {
        return true;
      }
    })
    .map(path => {
      let newPath = "";
      for (const packagePath of packages) {
        newPath = path.replace(packagePath, "");
      }
      newPath = newPath.replace("/package.json", "");
      return newPath;
    });

  return packageJsonPaths;
};

export { findDiff };
