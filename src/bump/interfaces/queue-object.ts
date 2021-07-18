import { PackageJson } from "../../utils/interfaces/package-json";

export interface QueueObject {
  packageFile: PackageJson;
  packagePath: string;
  bumpArg: string;
  verify: boolean;
}
