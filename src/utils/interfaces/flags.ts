export interface Flags {
  help: void;
}

export interface FlagsChanged extends Flags {
  "commit-to": string | undefined;
  "commit-from": string | undefined;
  "commit-message": string | undefined;
  "ignore-extension": string | undefined;
  packages: string | undefined;
}

export interface FlagsBump extends Flags {
  "no-verify": boolean;
  yes: boolean;
  "force-publish": boolean;
}

export interface FlagsBumpReturn {
  noVerify: boolean;
  skipPrompt: boolean;
  forcePublish: boolean;
}
