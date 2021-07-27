import { isValidBumpArg } from "./is-valid-bump-arg";

test("Is valid bump argument", () => {
  expect(isValidBumpArg("patch")).toBe(true);
  expect(isValidBumpArg("minor")).toBe(true);
  expect(isValidBumpArg("major")).toBe(true);
  expect(isValidBumpArg("from-package")).toBe(true);
  expect(isValidBumpArg("1.1.1")).toBe(true);

  expect(isValidBumpArg("test")).toBe(false);
});
