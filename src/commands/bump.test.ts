import chalk from "chalk";
import path from "path";
import { mocked } from "ts-jest/utils";

import Bump from "./bump";
import { bumpWrite } from "../bump/bump-write";

jest.mock("../bump/bump-write.ts");

describe("Bump command", () => {
  let result: any;

  beforeEach(() => {
    result = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation(val => result.push(String(val).trim()));

    const mockedBumpWrite = mocked(bumpWrite);
    mockedBumpWrite.mockResolvedValue([]);
  });

  afterEach(() => jest.restoreAllMocks());

  test("Success", async () => {
    await Bump.run(["patch"]);
  });
});
