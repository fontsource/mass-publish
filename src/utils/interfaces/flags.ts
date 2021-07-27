export interface Flags {
  help: void;
}

export interface FlagsChanged extends Flags {
  "commit-to": string | undefined;
  "commit-from": string | undefined;
  "ignore-extension": string | undefined;
  packages: string | undefined;
}

export interface FlagsBump extends Flags {
  "auto-bump": boolean;
  "no-verify": boolean;
  yes: boolean;
}

export interface FlagsBumpReturn {
  autoBump: boolean;
  noVerify: boolean;
  skipPrompt: boolean;
}

export interface FlagsPublish extends Flags {
  "force-publish": boolean;
}

export interface FlagsPublishReturn {
  forcePublish: boolean;
}
