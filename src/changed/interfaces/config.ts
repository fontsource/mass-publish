export interface Config {
  packages: string[];
  ignoreChanges?: string[];
  commitMessage: string;
  commitFrom: string;
  commitTo?: string;
}
