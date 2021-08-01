import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import { cli } from "cli-ux";
import * as dotenv from "dotenv";
import { publish } from "libnpmpublish";
import { manifest, tarball } from "pacote";
import PQueue from "p-queue";

import type { BumpObject } from "../bump/bump";

const queue = new PQueue({ concurrency: 6 });

const packPublish = async (bumpObject: BumpObject) => {
  const path = bumpObject.packagePath;

  cli.action.start(
    chalk.bold.blue(`Publishing ${bumpObject.packageFile.name}...`)
  );
  const packageManifest = await manifest(path);
  const tarData = await tarball(path);
  const npmVersion = `${bumpObject.packageFile.name}@${bumpObject.bumpedVersion}`;
  const token = process.env.NPM_AUTH_TOKEN;

  try {
    await publish(packageManifest, tarData, {
      access: "public",
      npmVersion,
      token,
    });
    cli.action.stop(
      chalk.bold.green(`Successfully published ${bumpObject.packageFile.name}!`)
    );
  } catch (error) {
    throw new CLIError(
      `Encountered an error publishing ${bumpObject.packageFile.name}! ${error}`
    );
  }
};

const npmPublish = (bumpObjects: BumpObject[]): Promise<void[]> => {
  dotenv.config();
  const publishArr: Promise<void>[] = [];

  if (!process.env.NPM_AUTH_TOKEN) {
    throw new CLIError("No NPM auth token found in environment!");
  }

  for (const bumpObject of bumpObjects) {
    if (!bumpObject.noPublish) {
      const publishItem = queue.add(() => packPublish(bumpObject));
      publishArr.push(publishItem);
    }
  }

  return Promise.all(publishArr);
};

export { npmPublish };
