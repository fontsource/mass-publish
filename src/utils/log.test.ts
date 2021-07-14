import chalk from "chalk";
import log from "./log";

test("Log function", () => {
  const results: any = [];
  jest
    .spyOn(process.stdout, "write")
    .mockImplementation(val => results.push(String(val).trim()));

  log("Hello");
  log(chalk.red("Red"));

  expect(results).toEqual(["Hello", chalk.red("Red")]);
});
