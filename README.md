# @stealthscale/config

Every configuration a stealth repository is built, checked, tested and released under, composed out
of layers rather than copied between repositories.

A repository states what it is built on and what is true only of itself:

```ts
import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200)],
});
```

What you extend composes; what you write beside it wins. That is the whole contract, and it is the
one `tsconfig.json` already taught everybody.

Nothing a machine works out on its own is reliable here, which is why the directory is declared
rather than discovered. Under `vp test` the working directory is the workspace root, and the frame a
config runs in is a bundled temporary file outside the package altogether.

## The packages

| Package                  | What it is for                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `vite-config-core`       | What a layer is and how layers compose: four kinds, three passes                         |
| `vite-config-typescript` | The tsconfigs every package compiles under, split into base, node and web                |
| `vite-config`            | A block for each part of a Vite+ config, and the tier a package is built on              |
| `vite-config-react`      | What a package that renders adds: the JSX transform, the React rules, the page directory |
| `vite-config-css`        | What a stylesheet is checked against and how it is built, whichever tools do it          |
| `vite-plugin-base`       | What a bundler plugin here is written with: a typed plugin, and what a build reached     |
| `vite-plugin-sbom`       | A bill of materials for what a build reached and the toolchain that produced it          |

The config packages give a repository its tiers, and a package extends exactly one. `preset/base`
publishes and says nothing about where it runs, `preset/node` publishes and runs on the console,
`preset/web` publishes and runs in a browser, and `preset/app` is deployed rather than published. A
workspace root takes `preset/workspace` instead, having nothing to pack, nothing to build and no
tests of its own.

The two plugins extend no tier and are written as plain Vite+ packages. The tiers reach for them, so
a plugin built by a tier would have to be packed before the package that packs it.

## Working on it

```bash
pnpm install
pnpm run ready     # bootstrap, then build, check and test
```

`ready` starts with `bootstrap`, which packs the plugins and then the config packages before
anything else runs. It has to: every example and every package imports the config by name, so each
one resolves through `dist`, exactly as a repository installing from npm does. A clean checkout has
no `dist`, and `vp run -r` reads every config in the workspace before it runs a single task.

Once bootstrapped, `vp run ci` builds, checks and tests in that order and caches nothing, so it
answers the same question on a laptop as under any provider.

Note: `lint` and `fmt` are read from the workspace root and nowhere else. A layer from either block
put in a package's own config is composed, merged, and then never seen. Where a package needs an
answer of its own, the glob says which files it reaches.

## Adding a layer

Four kinds, and each says something the others cannot:

| Kind         | What it does                 | When it runs                |
| ------------ | ---------------------------- | --------------------------- |
| `preset`     | Sets a block                 | First, ordered by `enforce` |
| `contribute` | Appends one item to a list   | In the order written        |
| `remove`     | Takes any layer back by name | Reaches what is above it    |
| `override`   | Rewrites the merged config   | Last                        |

All four kinds have a name. A removal names the layer it takes back, and `owned` prefixes those
names when a package hands its layers over under its own. The three a repository states for itself
also require a reason, each one being a departure from what the house already answered. A preset
requires none, its reason belonging to the package that states it rather than to every call site.

## Why it works this way

[Architecture decision records](docs/adr/) hold what a repository built on this inherits, and what
each decision cost. The examples under `examples/` are the other half: thirteen packages, each
configured for one thing worth seeing, with the reasoning in comments beside the layers.
