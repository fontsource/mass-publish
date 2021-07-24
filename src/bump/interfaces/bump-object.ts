import { PackageJson } from "../../utils/interfaces/package-json";

export interface BumpObject {
  packageFile: PackageJson;
  packagePath: string;
  bumpedVersion: string | false;
  failedValidation?: boolean;
}
