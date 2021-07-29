export interface Git {
  name: string;
  email: string;
}

export interface Config {
  packages: string[];
  ignoreExtension?: string[];
  commitMessage: string;
  git?: Git;
  commitFrom: string;
  commitTo?: string;
  noVerify?: boolean;
  autoBump?: boolean;
  yes?: boolean;
}
