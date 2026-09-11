# @stealthscale/vite-plugin-sbom

## 0.2.0

### Minor Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read `pnpm-lock.yaml`. A lockfile is the only place recording the integrity of what was installed
  and which registry it came from, so a bill of materials built in a pnpm repository listed every
  component without a hash and without a purl qualifier. Every document in the file is read, since
  pnpm writes the build it installed itself with ahead of a `---`. Adds `yaml` as a dependency.

### Patch Changes

- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-plugin-base@0.1.1
