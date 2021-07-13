import { Repository } from "nodegit";
import path from "path";

import { Config } from "./interfaces/config";

const findDiff = async ({
  packages,
  ignoreExtension = [],
  commitFrom,
  commitTo,
}: Config): Promise<string[]> => {
  const repo = await Repository.open(path.resolve(process.cwd()));

  // Compare commit from
  const from = await repo.getCommit(commitFrom);
  const fromTree = await from.getTree();

  // Compare commit to
  let commitToParam = commitTo;
  if (commitToParam === undefined) {
    commitToParam = await (await repo.getHeadCommit()).sha();
  }

  const to = await repo.getCommit(commitToParam);
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

  // Return package.json names
  const dirPaths = filteredPathArray
    // Remove filenames and only show dirs
    .map(filePath => path.dirname(filePath))
    // Remove any files that are included in the packages dir but not in a separate subdir
    .filter(dir => !packages.includes(`${dir}/`))
    // Remove any subdirectories within each package directory
    .map(dir => {
      let dirName: string[] = [];
      for (const packagePath of packages) {
        if (dir.startsWith(packagePath)) {
          dirName = [packagePath, dir.replace(packagePath, "").split("/")[0]];
        }
      }
      return path.join(dirName[0], dirName[1]);
    });

  // Multiple changed files in same dir would produce multiple duplicate dirPaths
  const noDuplicatesDirPaths = [...new Set(dirPaths)];
  return noDuplicatesDirPaths;
};

export { findDiff };
