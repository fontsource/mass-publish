export interface Config {
  packages: string[];
  ignoreExtension?: string[];
  commitMessage: string;
  commitFrom: string;
  commitTo?: string;
  noVerify?: boolean;
  autoBump?: boolean;
  yes?: boolean;
}
