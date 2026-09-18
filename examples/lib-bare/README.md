# @stealthscale/example-lib-bare

This package states no configuration. `vp pack` walks up to the workspace root's and composes that
one for this directory. The entry file comes from an argument the `build` script passes rather than
from a key in a configuration.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-bare build
pnpm --filter @stealthscale/example-lib-bare check
pnpm --filter @stealthscale/example-lib-bare test
```

The build writes `dist/index.mjs`, `dist/index.d.mts` beside it, and a CycloneDX document under
`dist/cyclonedx/`. Each of those comes from a layer in the root configuration, because this package
states none of its own.

## The configuration

`vp pack` looks in the working directory, then walks up as far as the directory with
`pnpm-workspace.yaml` in it, and loads the first `vite.config.ts` it finds. That file composes the
workspace tier, which adds a task table, a commit hook and the project list to the node tier's lint,
pack and test layers.

The directory each layer receives is this package rather than the root. A run started inside a
package that has no configuration of its own is configuring that package, so `pack.published` reads
the `stealth-source` condition in this `package.json` and finds `src/index.ts` behind it.

The `build` script is `vp pack src/index.ts`. The packer merges the command line over the `pack`
block it resolved, so the file it builds is the one named there. Moving `src/index.ts` means editing
the script.

## What it exports

| Export                        | What it returns                                       |
| ----------------------------- | ----------------------------------------------------- |
| `slug(title: string): string` | Lowercase ASCII letters and digits, joined by hyphens |

`slug` keeps `a-z` and `0-9`, and replaces every run of anything else with one hyphen. An accented
letter is dropped rather than folded onto its plain form, so `café` slugs to `caf`. A title with
nothing to keep slugs to the empty string, and a caller using the result as a key has to reject that
string itself.
