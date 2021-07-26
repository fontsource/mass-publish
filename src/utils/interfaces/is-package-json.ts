/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PackageJson } from "./package-json";

export const isPackageJson = (object: any): object is PackageJson => {
  return "name" in object;
};
