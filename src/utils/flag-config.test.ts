import { changedFlags, bumpFlags } from "./flag-config";

describe("Flag config", () => {
  const noFlags = {};
  const allFlags = {
    "commit-to": "test",
    "commit-from": "test",
    "commit-message": "test",
    "ignore-extension": ".js,.ts",
    packages: "/test/test",
    "no-verify": true,
    yes: true,
    "force-publish": true,
  };

  const config = {
    packages: ["test"],
    commitMessage: "chore()",
    commitFrom: "test",
  };
  test("Changed", () => {
    const newConfigNoChange = changedFlags(noFlags, config);
    expect(newConfigNoChange).toEqual(config);
    const newConfigAllChange = changedFlags(allFlags, config);
    expect(newConfigAllChange).toEqual({
      commitFrom: "test",
      commitTo: "test",
      commitMessage: "test",
      packages: ["/test/test"],
      ignoreExtension: [".js", ".ts"],
    });
  });

  test("Bump", () => {
    const newFlagsNoChange = bumpFlags(noFlags);
    expect(newFlagsNoChange).toEqual({
      noVerify: false,
      skipPrompt: false,
      forcePublish: false,
    });
    const newFlagsChange = bumpFlags(allFlags);
    expect(newFlagsChange).toEqual({
      noVerify: true,
      skipPrompt: true,
      forcePublish: true,
    });
  });
});
