export interface Config {
  packages: string[];
  ignoreExtension?: string[];
  commitMessage: string;
  commitFrom: string;
  commitTo?: string;
}
