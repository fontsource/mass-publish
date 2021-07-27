import jsonfile from "jsonfile";
import Init from "./init";

jest.setTimeout(50_000);
test("Init command", async () => {
  const results: any = [];
  jest
    .spyOn(process.stdout, "write")
    .mockImplementation(val => results.push(String(val).trim()));

  const writeFile = jest.spyOn(jsonfile, "writeFile").mockResolvedValue();

  await expect(Init.run()).resolves.not.toThrow();
  expect(writeFile).toHaveBeenCalledTimes(1);
  expect(results).toEqual(["mass-publish.json has been created."]);
});
