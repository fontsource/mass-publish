# mass-publish

A barebones bulk NPM publisher.

## How It Works

1. Use Nodegit to compare the last known mass-publish commit (or custom commit) with current to find differences.
2. Pull latest versions from the NPM registry and bump package.json in the specified range.
3. Pack and publish all packages.

git diff 136545a8c7a59c170249a46673efedb9c2627c1d --name-only -- packages/
