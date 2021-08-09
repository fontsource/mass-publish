import { CLIError } from "@oclif/errors";
import chalk from "chalk";
import { cli } from "cli-ux";
import { publish } from "libnpmpublish";
import { manifest, tarball } from "pacote";
import path from "path";
import PQueue from "p-queue";

import type { BumpObject } from "../bump/bump";

const queue = new PQueue({ concurrency: 6 });

const packPublish = async (bumpObject: BumpObject) => {
  const packagePath = path.join(process.cwd(), bumpObject.packagePath);
  const npmVersion = `${bumpObject.packageFile.name}@${bumpObject.bumpedVersion}`;

  cli.action.start(chalk.bold.blue(`Publishing ${npmVersion}...`));
  const packageManifest = await manifest(packagePath);
  const tarData = await tarball(packagePath);
  const token = process.env.NPM_TOKEN;

  try {
    await publish(packageManifest, tarData, {
      access: "public",
      npmVersion,
      token,
    });
    cli.action.stop(chalk.bold.green(`Successfully published ${npmVersion}!`));
  } catch (error) {
    throw new CLIError(
      `Encountered an error publishing ${bumpObject.packageFile.name}!\n${error}`
    );
  }
};

const npmPublish = (bumpObjects: BumpObject[]): Promise<void[]> => {
  const publishArr: Promise<void>[] = [];

  for (const bumpObject of bumpObjects) {
    if (!bumpObject.noPublish) {
      const publishItem = queue.add(() => packPublish(bumpObject));
      publishArr.push(publishItem);
    }
  }

  return Promise.all(publishArr);
};

export { npmPublish };
