import { promises as fs } from "fs";
import path from "path";
import { getGitConfig } from "./git-config";

import { exampleConfig1 } from "../utils/helpers/test-configs";

describe("Get git config", () => {
  afterEach(() => jest.restoreAllMocks());

  test("Config already has details", async () => {
    const git = { name: "Test", email: "test@testemail.com" };
    const exampleConfig = {
      ...exampleConfig1,
      git,
    };

    expect(await getGitConfig(exampleConfig)).toEqual(git);
  });

  test("Search OS for git", async () => {
    const git = { name: "Test", email: "test@testemail.com" };
    jest
      .spyOn(path, "join")
      .mockReturnValue(
        path.resolve(process.cwd(), "src/publish/fixtures/_gitconfig")
      );

    expect(await getGitConfig(exampleConfig1)).toEqual(git);
  });

  test("Return error", async () => {
    jest.spyOn(fs, "stat").mockRejectedValue("Bad");

    await expect(getGitConfig(exampleConfig1)).rejects.toThrow();
  });
});
