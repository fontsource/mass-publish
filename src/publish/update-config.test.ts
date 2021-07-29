// file.only
import { getHeadCommit, updateConfig } from "./update-config";

jest.setTimeout(50_000);

describe("Publish update config", () => {
  test("Get head commit", async () => {
    const commit = await getHeadCommit();
    expect(commit).toEqual("Hello");
  });

  test("Update config", async () => {});
});
