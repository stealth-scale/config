# @stealthscale/scale

[![ci](https://github.com/stealth-scale/config/actions/workflows/ci.yml/badge.svg)](https://github.com/stealth-scale/config/actions/workflows/ci.yml)
[![release](https://github.com/stealth-scale/config/actions/workflows/release.yml/badge.svg)](https://github.com/stealth-scale/config/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/@stealthscale/theme?label=%40stealthscale%2Ftheme)](https://www.npmjs.com/package/@stealthscale/theme)
[![node](https://img.shields.io/node/v/@stealthscale/theme)](https://nodejs.org)
[![license](https://img.shields.io/github/license/stealth-scale/config)](LICENSE)

`@stealthscale/scale` holds the building blocks a stealthscale application is built from. Today that
is the design system every interface is drawn from, the configuration tiers every package is built
and released through, and the testing kits both are held to. The component libraries and the
platform SDK move in next, from their own repositories.

## What is here

| Directory      | What it contains                                                      |
| -------------- | --------------------------------------------------------------------- |
| `packages/`    | What npm publishes under `@stealthscale/`                             |
| `foundations/` | The design system every stealthscale interface is drawn from          |
| `examples/`    | Private applications that each demonstrate one configuration decision |
| `docs/`        | The decision records, the design proposals and the writing standards  |

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

| Package                                                     | What it does                                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`vite-config-core`](packages/vite-config-core)             | Defines the four kinds of layer and composes a list of them into one Vite configuration                    |
| [`vite-config`](packages/vite-config)                       | Publishes the five tiers and a namespace of layers for each part of a Vite configuration                   |
| [`vite-config-typescript`](packages/vite-config-typescript) | Publishes the three TypeScript configurations a package extends: base, node and web                        |
| [`vite-config-plain`](packages/vite-config-plain)           | Packs and tests the kernel and the two plugins that every tier depends on                                  |
| [`vite-config-react`](packages/vite-config-react)           | Adds the JSX transform, the React lint rules, the DOM a test renders into and the MDX compiler             |
| [`vite-config-css`](packages/vite-config-css)               | Adds the Stylelint rules a stylesheet is checked against and the plugin that runs them                     |
| [`vite-config-theme`](packages/vite-config-theme)           | Adds the runtime generator to a design-system package and the stylesheet compiler to an application        |
| [`vite-plugin-base`](packages/vite-plugin-base)             | Supplies the typed plugin and the module-graph readers every bundler plugin here is built on               |
| [`vite-plugin-sbom`](packages/vite-plugin-sbom)             | Writes a CycloneDX bill of materials from the modules a build reached                                      |
| [`vite-plugin-theme`](packages/vite-plugin-theme)           | Generates the styling runtime of a design system and compiles the stylesheet of an application             |
| [`pandacss-naming`](packages/pandacss-naming)               | Writes the class names of a design system in one readable scheme, for the stylesheet and the browser alike |
| [`pandacss-compiler`](packages/pandacss-compiler)           | Renames a compiled stylesheet and its generated runtime into that scheme                                   |
| [`testing`](packages/testing)                               | Builds the scratch workspaces and manifests a specification runs a tree from                               |
| [`testing-react`](packages/testing-react)                   | Reads a rendered component through the part names and data attributes on its anatomy                       |
| [`testing-config`](packages/testing-config)                 | Checks a config, plugin or library package against the contract its kind keeps                             |
| [`testing-theme`](packages/testing-theme)                   | Checks a theme, a recipe or a preset against the theme contract and the contrast table                     |

## The design system

| Package                      | What it does                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`theme`](foundations/theme) | Publishes the foundation every recipe is written against, the runtime every component binds with, and the vocabulary a theme is written in |

A recipe is written against the foundation's vocabulary alone, so a component reads it in a browser
and a configuration reads it in node alike. Filling the contract takes two calls, and a theme moves
whatever it wants from there. The build plugin compiles one stylesheet from every preset and theme
in the dependency graph, and scopes each theme under `data-theme`. It renames every class into the
naming scheme, so `button--lg` reaches the page rather than the compiler's own name.

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
`css.layers()`. A design-system package and an application that wears one add `theme.layers()`.

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

| Example                                     | What it shows                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| [`app-host`](examples/app-host)             | An application that loads another one at run time through Module Federation      |
| [`app-remote`](examples/app-remote)         | An application built to be loaded by another one                                 |
| [`app-tanstack`](examples/app-tanstack)     | A routed application with a federated remote mounted under one of its addresses  |
| [`app-react`](examples/app-react)           | What the React configuration package adds to an application that renders         |
| [`app-web`](examples/app-web)               | A pinned port and a proxied path, with no framework in the page                  |
| [`app-ssr`](examples/app-ssr)               | Server-side rendering and the dependency the server bundle has to contain        |
| [`app-worker`](examples/app-worker)         | Arithmetic on a worker thread that the dependency scan finds                     |
| [`lib-bare`](examples/lib-bare)             | A library that takes the workspace root's configuration                          |
| [`lib-core`](examples/lib-core)             | A library that reaches for neither node's globals nor the browser's              |
| [`lib-node`](examples/lib-node)             | A library published for node                                                     |
| [`lib-cli`](examples/lib-cli)               | A library that installs a command named for what it does                         |
| [`lib-tokens`](examples/lib-tokens)         | A pack hook that writes part of what the library ships                           |
| [`lib-ui`](examples/lib-ui)                 | A component library four of the example applications share                       |
| [`lib-actions`](examples/lib-actions)       | A button drawn by a recipe, with the preset that registers it                    |
| [`lib-surfaces`](examples/lib-surfaces)     | A card of four parts drawn by one slot recipe, with the preset that registers it |
| [`theme-fathom`](examples/theme-fathom)     | A deep teal theme on marine greys, rounder than the foundation                   |
| [`theme-folio`](examples/theme-folio)       | An editorial theme with a violet brand and a serif to read it in                 |
| [`theme-forge`](examples/theme-forge)       | A warm console theme with cream surfaces, an amber brand and flat shadows        |
| [`theme-abyss`](examples/theme-abyss)       | A theme derived from another one rather than from the foundation                 |
| [`theme-single`](examples/theme-single)     | A page in one theme that switches its color mode                                 |
| [`theme-multiple`](examples/theme-multiple) | A page that switches between four themes and two color modes                     |

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
that were argued before they were accepted. [SECURITY.md](SECURITY.md) covers how to report a
vulnerability.

## Licence

MIT. See [LICENSE](LICENSE).
