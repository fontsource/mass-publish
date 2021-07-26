export interface PackageJson {
  name: string;
  version: string;
}

export interface Removed {
  removed: boolean;
}

export type PackageJsonObject = PackageJson | Removed;
