/* eslint-disable complexity */
/* eslint-disable new-cap */
import fs from "fs";
import { walk, TREE } from "isomorphic-git";

import path from "path";

import { Config } from "./interfaces/config";
import { GitWalk } from "./interfaces/git-walk";

const findDiff = async ({
  packages,
  ignoreExtension = [],
  commitFrom,
  commitTo = "HEAD",
}: Config): Promise<string[]> => {
  // Diffs the two commmits
  const files: GitWalk[] = await walk({
    fs,
    dir: process.cwd(),
    trees: [TREE({ ref: commitFrom }), TREE({ ref: commitTo })],
    async map(filepath, [A, B]) {
      // ignore directories
      if (filepath === ".") {
        return;
      }
      if (
        (A && (await A.type())) === "tree" ||
        (B && (await B.type()) === "tree")
      ) {
        return;
      }

      // generate ids
      const Aoid = A ? await A.oid() : undefined;
      const Boid = B ? await B.oid() : undefined;

      // determine modification type
      let type = "equal";
      if (Aoid !== Boid) {
        type = "modify";
      }
      if (Aoid === undefined) {
        type = "add";
      }
      if (Boid === undefined) {
        type = "remove";
      }
      if (Aoid === undefined && Boid === undefined) {
        throw new Error(`Git walk error: ${A} ${B}`);
      }

      // eslint-disable-next-line consistent-return
      return {
        path: `${filepath}`,
        type,
      };
    },
  });

  const filteredFiles = files
    .filter(item => item.type !== "equal")
    .map(item => item.path);

  // Removes all diffs that do not match the configuration
  const filteredPaths = filteredFiles.filter(path => {
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
  const dirPaths = filteredPaths
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
