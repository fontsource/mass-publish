import * as fs from "fs/promises"

import { bumpWrite } from "./bump-write";

import type { BumpObject } from "./bump";

describe("Bump write function", () => {
  test("Should not throw", async () => {
    jest.spyOn(fs, "writeFile").mockResolvedValue();

    const bumpList: BumpObject[] = [
      {
        packageFile: { name: "test-package", version: "1.0.0" },
        packagePath: "src/publish/fixtures/",
        bumpedVersion: "1.1.0",
      },
      {
        packageFile: { name: "test-package2", version: "1.1.0" },
        packagePath: "src/publish/fixtures/",
        bumpedVersion: "1.2.0",
      },
    ];
    await expect(bumpWrite(bumpList)).resolves.not.toThrow();
  });
});
