# mass-publish

A barebones bulk NPM publisher.

## How It Works

1. Use Nodegit to compare the last known mass-publish commit (or custom hash) with the latest commits and determine the changes from the diff.
2. Bump packages and validate they are publishable by comparing versions on the NPM registry using package-json.
3. Use pacote and libnpmpublish to pack and publish the packages using an async queue.
