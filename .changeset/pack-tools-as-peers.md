---
"@stealthscale/vite-config": patch
---

Declare the tools the layers turn on as peers: `publint` and `@arethetypeswrong/core`, which
`pack.quality` runs over every package that publishes, and `@vitest/coverage-v8`, which
`test.coverage` names as its provider. All three were devDependencies alone, so a repository taking
the toolchain got the layers without the tools and met `Failed to import module "publint"` on its
first pack and `Cannot find dependency '@vitest/coverage-v8'` on its first test run. They worked
here only because this repository installs them for its own packages.
