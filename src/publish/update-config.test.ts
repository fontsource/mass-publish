import jsonfile from "jsonfile";

import { exampleConfig1 } from "../utils/helpers/test-configs";
import { getHeadCommit, updateConfig } from "./update-config";

import type { Config } from "../changed/changed";

jest.setTimeout(50_000);

describe("Publish update config", () => {
  afterAll(() => jest.restoreAllMocks());

  test("Get head commit", async () => {
    const commit = await getHeadCommit();
    expect(commit.length).toEqual(40);
  });

  test("Update config", async () => {
    let input: Partial<Config> = {};
    jest.spyOn(jsonfile, "writeFile").mockImplementation((_, val2) => {
      input = val2;
      return Promise.resolve();
    });

    await expect(updateConfig(exampleConfig1)).resolves.not.toThrow();
    expect(input.commitTo?.length).toEqual(40);
  });
});
