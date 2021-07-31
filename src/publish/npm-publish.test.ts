import chalk from "chalk";
import { cli } from "cli-ux";
import { publish } from "libnpmpublish";
import { mocked } from "ts-jest/utils";

import { findDiff } from "../changed/changed";
import { createBumpObject } from "../bump/bump";
import { exampleConfig3 } from "../utils/helpers/test-configs";
import { npmPublish } from "./npm-publish";

import type { BumpObject } from "../bump/bump";

jest.mock("dotenv");
jest.mock("libnpmpublish");

describe("NPM publish function", () => {
  const OLD_ENV = process.env;
  let results: any;
  const mockedPublish = mocked(publish);
  let diff;
  let bumpObjects: BumpObject[];

  beforeEach(async () => {
    jest.resetModules();
    results = [];
    process.env = { ...OLD_ENV };

    mockedPublish.mockResolvedValue();

    diff = await findDiff(exampleConfig3);
    bumpObjects = await createBumpObject(diff, "patch");
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => results.push(String(val).trim()));
    jest
      .spyOn(process.stderr, "write")
      .mockImplementation(val => results.push(String(val).trim()));

    jest
      .spyOn(cli.action, "start")
      .mockImplementation(val => results.push(String(val).trim()));
    jest
      .spyOn(cli.action, "stop")
      .mockImplementation(val => results.push(String(val).trim()));
  });

  afterEach(() => jest.restoreAllMocks());

  afterAll(() => {
    process.env = { ...OLD_ENV };
  });

  test("Success", async () => {
    process.env.NPM_AUTH_TOKEN = "test";

    await expect(npmPublish(bumpObjects)).resolves.not.toThrow();
    expect(results).toEqual([
      chalk.bold.blue("Publishing test2..."),
      chalk.bold.green("Successfully published test2!"),
    ]);
  });

  test("Failed publish", async () => {
    process.env.NPM_AUTH_TOKEN = "test";
    mockedPublish.mockRejectedValue("test-fail");

    await expect(npmPublish(bumpObjects)).rejects.toThrow(
      "Encountered an error publishing test2! test-fail"
    );
  });
  test("No NPM auth token", async () => {
    const diff = await findDiff(exampleConfig3);
    const bumpObjects = await createBumpObject(diff, "from-package");

    await expect(async () => npmPublish(bumpObjects)).rejects.toThrow(
      "No NPM auth token found in environment!"
    );
  });
});
