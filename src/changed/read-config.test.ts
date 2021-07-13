import { readConfig } from "./read-config";

describe("Read config", () => {
  test("If file loads", () => {
    return readConfig().then(data => {
      return expect(data).toBeDefined();
    });
  });
});
