---
"@stealthscale/vite-plugin-sbom": minor
---

Read `pnpm-lock.yaml`. A lockfile is the only place recording the integrity of what was installed
and which registry it came from, so a bill of materials built in a pnpm repository listed every
component without a hash and without a purl qualifier. Every document in the file is read, since
pnpm writes the build it installed itself with ahead of a `---`. Adds `yaml` as a dependency.
