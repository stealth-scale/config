# @stealthscale/scale

`@stealthscale/scale` is the stealthscale monorepo. The packages here configure, check, test and
release every other stealthscale package. The component libraries, the providers, the SDKs and the
plugins move in from their own repositories.

## What is here

| Directory   | What it contains                                                      |
| ----------- | --------------------------------------------------------------------- |
| `packages/` | What npm publishes under `@stealthscale/`                             |
| `examples/` | Private applications that each demonstrate one configuration decision |
| `docs/`     | The decision records, the design proposals and the writing standards  |

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

Declare the directory rather than discovering it. Under `vp test` the working directory is the
workspace root. A configuration runs from a bundled temporary file outside the package it
configures. `import.meta.dirname` names the directory from there and nothing else does.

## The packages

| Package                                                     | What it does                                                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`vite-config-core`](packages/vite-config-core)             | Defines the four kinds of layer and composes a list of them into one Vite configuration      |
| [`vite-config`](packages/vite-config)                       | Publishes the five tiers and a namespace of layers for each part of a Vite configuration     |
| [`vite-config-typescript`](packages/vite-config-typescript) | Publishes the three TypeScript configurations a package extends: base, node and web          |
| [`vite-config-plain`](packages/vite-config-plain)           | Packs and tests the kernel and the two plugins that every tier depends on                    |
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

The tiers build on the kernel and the two bundler plugins. All three pack under
`@stealthscale/vite-config-plain` rather than extending a tier.

## Layers

| Kind         | What it does                         | When it runs                         |
| ------------ | ------------------------------------ | ------------------------------------ |
| `preset`     | Sets configuration keys outright     | First, ordered by `enforce`          |
| `contribute` | Appends one item to a list at a path | After every preset, in written order |
| `remove`     | Takes a layer back by name           | Reaches the nearest match above it   |
| `override`   | Rewrites the merged configuration    | Last                                 |

A layer takes the name of the call that made it. `server.port(4200)` returns a layer named
`server.port(4200)`. A removal targets that name. A contribution, a removal and an override each
require a `because`. The conformance check rejects an empty one. A preset requires none. Its reason
belongs to the package that states it.

Note: the linter and the formatter read the workspace root only. A `lint` or `fmt` layer written in
a package composes and merges like any other. Both tools then ignore it.

## The examples

| Example                                 | What it shows                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| [`app-host`](examples/app-host)         | An application that loads another one at run time through Module Federation     |
| [`app-remote`](examples/app-remote)     | An application built to be loaded by another one                                |
| [`app-tanstack`](examples/app-tanstack) | A routed application with a federated remote mounted under one of its addresses |
| [`app-react`](examples/app-react)       | What the React configuration package adds to an application that renders        |
| [`app-web`](examples/app-web)           | A pinned port and a proxied path, with no framework in the page                 |
| [`app-ssr`](examples/app-ssr)           | Server-side rendering and the dependency the server bundle has to contain       |
| [`app-worker`](examples/app-worker)     | Arithmetic on a worker thread that the dependency scan finds                    |
| [`lib-bare`](examples/lib-bare)         | A library that takes the workspace root's configuration                         |
| [`lib-core`](examples/lib-core)         | A library that reaches for neither node's globals nor the browser's             |
| [`lib-node`](examples/lib-node)         | A library published for node                                                    |
| [`lib-cli`](examples/lib-cli)           | A library that installs a command named for what it does                        |
| [`lib-tokens`](examples/lib-tokens)     | A pack hook that writes part of what the library ships                          |
| [`lib-ui`](examples/lib-ui)             | A component library four of the example applications share                      |

## Working on it

```bash
pnpm install
pnpm run ready
```

`ready` runs `bootstrap` and then `vp run ci`. `bootstrap` packs every package under `packages/` in
dependency order. Every example and every package imports the configuration by name and resolves
through `dist`, exactly as a repository installing from npm does. A clean checkout has no `dist`
yet.

After the bootstrap, `vp run ci` runs `vp run -r build`, then `vp check`, then `vp test --run`. The
task runs all three every time. A green run means all three passed. Put a flag for the runner before
the task name. Anything after the task name goes to the task. `vp run -v ci` is verbose, while
`vp run ci -v` passes `-v` to `vp test`.

[CONTRIBUTING.md](CONTRIBUTING.md) covers the pull request, the changeset and the three standards
under [docs/standards/](docs/standards/). The [architecture decision records](docs/adr/) record what
every package here inherits and what each decision cost. The [RFCs](docs/rfc/) set out the designs
that were argued before they were accepted.

## Licence

MIT. See [LICENSE](LICENSE).
