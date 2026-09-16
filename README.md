# @stealthscale/config

Every configuration a stealth repository is built, checked, tested and released under. A repository
composes its configuration from named layers rather than copying a configuration file between
repositories. The packages under `packages/` are published to npm, and the thirteen examples under
`examples/` each show one configuration decision.

## The contract

A package extends the tier it is built on and states what is true only of itself.

```ts
import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200)],
});
```

Layers listed in `extends` compose first. Keys written beside `extends` are merged over the result
and win. The `extends` key itself never reaches Vite.

The directory is declared rather than discovered. Under `vp test` the working directory is the
workspace root, and a configuration runs from a bundled temporary file outside the package it
configures. `import.meta.dirname` is the only reliable way to name the directory.

## The packages

| Package                                                     | What it does                                                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`vite-config-core`](packages/vite-config-core)             | Defines the four kinds of layer and composes a list of them into one Vite configuration      |
| [`vite-config`](packages/vite-config)                       | Publishes the five tiers, and a namespace of layers for each part of a Vite configuration    |
| [`vite-config-typescript`](packages/vite-config-typescript) | Publishes the three TypeScript configurations a package extends: base, node and web          |
| [`vite-config-plain`](packages/vite-config-plain)           | Configures the kernel and the two plugins, which cannot extend a tier that is built on them  |
| [`vite-config-react`](packages/vite-config-react)           | Adds the JSX transform, the React lint rules and the DOM a test renders into                 |
| [`vite-config-css`](packages/vite-config-css)               | Adds the Stylelint rules a stylesheet is checked against and the plugin that runs them       |
| [`vite-plugin-base`](packages/vite-plugin-base)             | Supplies the typed plugin and the module-graph readers every bundler plugin here is built on |
| [`vite-plugin-sbom`](packages/vite-plugin-sbom)             | Writes a CycloneDX bill of materials from the modules a build reached                        |
| [`testing`](packages/testing)                               | Builds the scratch workspaces and manifests a specification runs a tree from                 |
| [`testing-react`](packages/testing-react)                   | Reads a rendered component through the part names and data attributes on its anatomy         |
| [`testing-config`](packages/testing-config)                 | Checks a config, plugin or library package against the contract its kind keeps               |

## The tiers

`@stealthscale/vite-config` publishes five tiers under `./preset/*`. A package extends exactly one.

| Tier               | For                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `preset/base`      | A published package that commits to no runtime. Neither node's globals nor the browser's are in scope    |
| `preset/node`      | A published package that runs on node                                                                    |
| `preset/web`       | A published package that runs in a browser. A test runs against a DOM                                    |
| `preset/app`       | A browser application that is deployed rather than published                                             |
| `preset/workspace` | A repository root. The node tier, plus the task cache, the `ci` task, the staged checks and the projects |

An add-on configuration package exports `layers()` for a package and `workspace()` for a root. A
package that renders adds `react.layers()` beside its tier. A package with stylesheets adds
`css.layers()`.

The kernel and the two bundler plugins extend no tier, because the tiers are built on them. Each one
is packed under `@stealthscale/vite-config-plain` instead.

## Layers

| Kind         | What it does                         | When it runs                         |
| ------------ | ------------------------------------ | ------------------------------------ |
| `preset`     | Sets configuration keys outright     | First, ordered by `enforce`          |
| `contribute` | Appends one item to a list at a path | After every preset, in written order |
| `remove`     | Takes a layer back by name           | Reaches the nearest match above it   |
| `override`   | Rewrites the merged configuration    | Last                                 |

A layer is named for the call that made it, so `server.port(4200)` returns a layer named
`server.port(4200)` and a removal targets that name. A contribution, a removal and an override each
require a `because`, and the conformance check rejects an empty one. A preset requires none, because
its reason belongs to the package that states it.

Note: `lint` and `fmt` are read from the workspace root only. A layer of either kind written in a
package's own configuration is composed and merged, and neither tool ever reads it.

## The examples

| Example                                 | What it shows                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| [`app-host`](examples/app-host)         | An application that loads another one at run time through Module Federation       |
| [`app-remote`](examples/app-remote)     | An application built to be loaded by another one                                  |
| [`app-tanstack`](examples/app-tanstack) | A routed application with a federated remote mounted under one of its addresses   |
| [`app-react`](examples/app-react)       | What the React configuration package adds to an application that renders          |
| [`app-web`](examples/app-web)           | A browser application on a pinned port, reading what the build told it            |
| [`app-ssr`](examples/app-ssr)           | An application rendered on a server, and the dependency its server bundle carries |
| [`app-worker`](examples/app-worker)     | Arithmetic moved off the main thread, in a worker bundled as a module             |
| [`lib-bare`](examples/lib-bare)         | A library with no configuration of its own, taking the workspace root's           |
| [`lib-core`](examples/lib-core)         | A library that reaches for neither node's globals nor the browser's               |
| [`lib-node`](examples/lib-node)         | A library published for node                                                      |
| [`lib-cli`](examples/lib-cli)           | A library that installs a command, named for what it does                         |
| [`lib-tokens`](examples/lib-tokens)     | A library that writes part of what it ships, through a pack hook                  |
| [`lib-ui`](examples/lib-ui)             | A component library four of the example applications share                        |

## Working on it

```bash
pnpm install
pnpm run ready
```

`ready` runs `bootstrap` and then `vp run ci`. `bootstrap` packs every package under `packages/` in
dependency order. Every example and every package imports the configuration by name and resolves
through `dist`, exactly as a repository installing from npm does, and a clean checkout has no `dist`
yet.

Once a checkout is bootstrapped, `vp run ci` runs `vp run -r build`, then `vp check`, then
`vp test --run`. The task is not cached, so a green run means those three commands ran. A flag for
the runner goes before the task name, and anything after the task name is handed to the task:
`vp run -v ci` is verbose, and `vp run ci -v` passes `-v` to `vp test`.

[CONTRIBUTING.md](CONTRIBUTING.md) covers the pull request, the changeset and the three standards
under [docs/standards/](docs/standards/). The [architecture decision records](docs/adr/) record what
a repository built on this inherits and what each decision cost. The [RFCs](docs/rfc/) set out the
designs that were argued before they were accepted.

## Licence

MIT. See [LICENSE](LICENSE).
