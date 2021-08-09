import chalk from "chalk";
import { cli } from "cli-ux";
import { publish } from "libnpmpublish";
import { mocked } from "ts-jest/utils";

import { findDiff } from "../changed/changed";
import { createBumpObject } from "../bump/bump";
import { exampleConfig3 } from "../utils/helpers/test-configs";
import { npmPublish } from "./npm-publish";

import type { Response } from "node-fetch";
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

    mockedPublish.mockResolvedValue({} as Response);

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
    process.env.NPM_TOKEN = "test";

    await expect(npmPublish(bumpObjects)).resolves.not.toThrow();
    expect(results).toEqual([
      chalk.bold.blue("Publishing test2@1.1.1..."),
      chalk.bold.green("Successfully published test2@1.1.1!"),
    ]);
  });

  test("Failed publish", async () => {
    process.env.NPM_TOKEN = "test";
    mockedPublish.mockRejectedValue("test-fail");

    await expect(npmPublish(bumpObjects)).rejects.toThrow(
      "Encountered an error publishing test2!\ntest-fail"
    );
  });
});
