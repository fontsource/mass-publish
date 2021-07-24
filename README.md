# UNDER DEVELOPMENT

# mass-publish

A barebones bulk NPM publisher.

## Getting Started

You can install the CLI from NPM as a devDependency for your project.

```bash
npm install mass-publish -D
```

Then automatically generate `mass-publish.json` which will be used as the main configuration. It will also keep track of the last published commit for detecting changes.

```bash
npx mass-publish init
```

## Configuration

```js
{
    packages: ["packages/"], // Directories to check for changes
    ignoreExtension: [".json"], // Ignore differneces with file extension of a certain type (Optional)
    commitMessage: "chore: release new versions", // Commit message on publish
    commitFrom: "fullsha", // Commit SHA to compare differences from. This is automatically updated on every publish.
    commitTo: "fullsha", // Commit SHA to compare differences to. Default is the head commit (Optional)
    noVerify: false, // Refer to changed command flag
    autobump: false, // Refer to bump command flag
    yes: false, // Refer to bump command flag
}
```

Reference: [`config.ts`](https://github.com/fontsource/mass-publish/blob/main/src/changed/interfaces/config.ts)

## Commands

## How It Works

1. Use isomorphic-git to compare the last known mass-publish commit (or custom hash) with the latest commits and determine the changes from the diff.
2. Bump packages and validate they are publishable by comparing versions on the NPM registry using package-json.
3. Use pacote and libnpmpublish to pack and publish the packages using an async queue.
