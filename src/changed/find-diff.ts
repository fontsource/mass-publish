import execa from "execa";
import { promises as fs } from "fs";
import path from "path";

import type { Config } from "./changed";

const findDiff = async (
  { packages, ignoreExtension = [], commitFrom, commitTo = "HEAD" }: Config,
  forcePublish = false
): Promise<string[]> => {
  if (forcePublish) {
    // Find all directories in packages specified directories
    const dirs = [];
    for (const packageDir of packages) {
      const packagesToUpdate = fs.readdir(
        path.join(process.cwd(), packageDir),
        { withFileTypes: true }
      );
      dirs.push(packagesToUpdate);
    }

    // Convert Promise<string[]>[] to string[]
    const diff = await Promise.all(dirs);
    const flattenedDiff = diff
      .flat()
      // Ignore single files only show directories
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return flattenedDiff;
  }
  // Diffs the two commmits
  const files = await execa("git", [
    "diff",
    "--name-only",
    commitFrom,
    commitTo,
  ]);

  // Files only returns a single string of all of stdout
  const filteredFiles = files.stdout.split("\n");

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

      // Ignore package.json
      if (path.endsWith("package.json")) {
        match = false;
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
