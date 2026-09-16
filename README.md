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
| `vite-config-plain`      | The configuration the kernel and the plugins are packed under, written out               |
| `vite-config`            | A block for each part of a Vite+ config, and the five tiers a package is built on        |
| `vite-config-react`      | What a package that renders adds: the JSX transform, the React rules, the page directory |
| `vite-config-css`        | What a stylesheet is checked against and how it is built, whichever tools do it          |
| `vite-plugin-base`       | What a bundler plugin here is written with: a typed plugin, and what a build reached     |
| `vite-plugin-sbom`       | A bill of materials for what a build reached and the toolchain that produced it          |
| `testing`                | The scratch workspace and the manifest writers a specification builds a tree with        |
| `testing-react`          | The readers a specification uses on a rendered component, and the component contract     |
| `testing-config`         | The contract a config or plugin package keeps, checked by one specification per package  |

`@stealthscale/vite-config` gives a repository its tiers, and a package extends exactly one.
`preset/base` publishes and says nothing about where it runs, `preset/node` publishes and runs on
the console, `preset/web` publishes and runs in a browser, and `preset/app` is deployed rather than
published. A workspace root extends `preset/workspace`, which is the node tier plus the task cache,
the `ci` task, the staged checks and the list of projects. The root keeps the pack layers because a
package with no config of its own is packed through the root's.

An add-on package exports `layers()` for a package and `workspace()` for a root. A package that
renders adds `react.layers()` beside its tier, and a package with stylesheets adds `css.layers()`.

The kernel and the two plugins extend no tier, because the tiers are built on them. Each is packed
under `@stealthscale/vite-config-plain`, which is the node tier's `pack`, `resolve`, `ssr` and
`test` blocks written out.

Every package imports `vite` and peers on `vite`. The toolchain is named in two places: the `vp`
scripts in each manifest, and the `types` entry of the shared tsconfig that loads its type
augmentation. Nothing else changes when the toolchain does.

## Working on it

```bash
pnpm install
pnpm run ready     # bootstrap, then build, check and test
```

`ready` starts with `bootstrap`, which packs every package under `packages/` in dependency order
before anything else runs. It has to: every example and every package imports the config by name, so
each one resolves through `dist`, exactly as a repository installing from npm does. A clean checkout
has no `dist`, and `vp run -r` reads every config in the workspace before it runs a single task.

Once bootstrapped, `vp run ci` builds, checks and tests in that order. The builds are package
scripts and replay from the task cache when nothing they read has changed. The check and the test
steps run every time, and `vp run --no-cache ci` re-runs the builds as well.

A flag for the runner goes before the task name. `vp run -v ci` is verbose. `vp run ci -v` hands
`-v` to `vp test`, which prints its version and exits without running a test.

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

All four kinds have a name, and the name is the call that made the layer:
`lint.relax({ files: ["**/*.spec.tsx"] })` returns a layer named `lint.relax(**/*.spec.tsx)`, and
`react.layers()` returns `react.plugin.refresh`, `react.test.cleanup` and `react.test.document`. A
removal names the layer it takes back by that name. The three kinds a repository states for itself
also require a reason, each one being a departure from what the house already answered. A preset
requires none, its reason belonging to the package that states it rather than to every call site.

A relaxation that belongs to one package is written beside that package in `vite.layers.ts`, and the
root imports it. The globs are written from the root, because the linter reads the root config only,
and the reason is written next to the code it excuses.

Every package under `packages/` keeps the same contract, and `@stealthscale/testing-config` checks
it from one specification per package: what the manifest publishes, what the barrel exports, and
what each layer is called and carries.

## Why it works this way

[Architecture decision records](docs/adr/) hold what a repository built on this inherits, and what
each decision cost. The examples under `examples/` are the other half: thirteen packages, each
configured for one thing worth seeing, with the reasoning in comments beside the layers.
