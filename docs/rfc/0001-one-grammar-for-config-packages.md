---
rfc: 0001
title: One grammar for config and plugin packages
author: Roy Klopper
status: Accepted
created: 2026-09-16
updated: 2026-09-16
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: 0007
---

# RFC-0001: One grammar for config and plugin packages

## Summary

We propose one grammar for every configuration package and every plugin package in this repository.
The grammar has nine rules. They cover the tier import, the add-on exports, factory and layer names,
the arguments of a departure from the house answer, compiler fragments, the layout of a plugin
package, the shared plain configuration, and where a package writes its relaxations. The kernel
gains one helper, `named()`. After the change, a consumer writes the same five lines in every
package. A conformance suite can then check every package against the grammar.

## Motivation

### The problem

The configuration packages export 102 functions that return a layer or a list of layers. Each block
was written separately and settled its own conventions. A consumer cannot predict a factory name, an
argument form, or a layer name from the ones they already know.

**Factory names use four grammars.**

- A noun sets a block: `test.coverage`, `build.chunks`, `pack.declarations`.
- A verb changes the house answer: `lint.relax`, `fmt.skip`, `fmt.group`.
- A past participle does either. `build.served` sets a base URL. `deps.crawled` appends a crawl
  entry. `staged.checked` sets a hook. `test.uncounted` appends a coverage exclusion.
- An adjective or a compound covers the rest: `fmt.internal`, `test.globalSetup`,
  `pack.buildBefore`.

**Argument shapes use five grammars.**

- `{ because, files }` in `lint.relax`, `fmt.skip` and `test.uncounted`.
- `{ because, from }` in `deps.crawled`.
- `{ because, deps }` in `deps.prebundled` and `ssr.bundled`.
- A positional reason in `pack.buildBefore(because, runs)`, and a field in
  `pack.hook({ because, hooks })`.
- No reason in `test.covering({ branches: 80 })`, because the kernel does not ask a preset for one.

**Layer names use three grammars inside one composed tier.** A removal targets a layer by its name.
On 2026-09-16 the React application tier composed to these names:

```
react/react.refresh
react/react.cleanup
react/test.environment(happy-dom)
```

The React workspace layers composed to these names:

```
react/fmt.group(react)
react/react.plugin(react)
react/lint.relax(**/*.spec.tsx, **/*.fixtures.tsx)
react/lint.enforce(**/*.{ts,tsx})
```

- The `react/` prefix comes from `owned("react", layers)`.
- The second `react.` comes from the factory.
- `lint.relax(...)` is the name of the call that `rendered()` delegates to. It is not the name of
  `rendered()`.
- A consumer who removes React's document layer has to write
  `target: "react/test.environment(happy-dom)"`. No README states this name.
- The stylesheet package's layers are `stylelint.check` and `stylelint.warn`. Those names come from
  the tool, not from the package.
- Inside `vite-config`, `server.port(4200)` carries its argument in its name. `server.reachable` and
  `server.bound` do not.
- `pack.buildBefore(...)` returns a layer named `pack.hook(build:before)`.

**The word `override` has three meanings.**

- The kernel's fourth layer kind rewrites the merged config.
- The modules `fmt/override.ts`, `lint/override.ts` and `test/override.ts` contain contributions and
  presets. Each one contains zero overrides.
- The stylesheet package exports an `override` namespace. Its one function returns a removal and a
  contribution.

**Entry points differ by package.**

- A tier is imported from `@stealthscale/vite-config/preset/app`. A package that renders imports it
  from `@stealthscale/vite-config-react/preset/app` instead. Both React tiers add the same three
  layers on top of two different base tiers.
- The stylesheet package has no tier. A package adds `plugin.check()` to `extends`. The example that
  does so renames the import to `stylelint`, because the name `plugin` says nothing.
- A root imports the node tier and adds `workspace()` from `vite-config` and `preset.workspace()`
  from `vite-config-react`.
- A compiler config extends `@stealthscale/vite-config-typescript/web.json`. A package that renders
  extends `@stealthscale/vite-config-react/web.json` instead. The second file is a whole tier that
  adds one option.

**One plain configuration is copied into three packages.** `vite-config-core`, `vite-plugin-base`
and `vite-plugin-sbom` cannot take a tier, because the tiers depend on the bill of materials plugin.
Each copy has a comment that says a change has to be made in both places.

### Why now

- The gate does not detect any of this. On 2026-09-16 it passed with 832 tests and full coverage
  while the README tables of three packages listed exports that did not exist.
- This repository becomes the one monorepo for every stealthscale package. Every configuration in
  the tooling, platform, theming, ui, product and docs repositories is rewritten once when it
  arrives. Rewriting them to one grammar costs the same as rewriting them to the current four.
  Rewriting them a second time costs the same amount again.

### Why this layer

The grammar belongs in the configuration packages and not in a style guide. Without a check, the
next package breaks the rule. A separate proposal describes a conformance suite that checks what
this document states.

## Detailed design

### The consumer's config files

A package that renders and has stylesheets writes this `vite.config.ts`:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/web";
import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), css.layers()],
});
```

It writes this `tsconfig.json`:

```json
{
  "extends": [
    "@stealthscale/vite-config-typescript/web.json",
    "@stealthscale/vite-config-react/web.json"
  ]
}
```

The workspace root writes this `vite.config.ts`:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/workspace";
import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";

export default defineConfig(import.meta.dirname, {
  extends: [react.workspace(), css.workspace()],
});
```

A package that departs from the house answer adds each departure to the same list:

```ts
export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    lint.relax({
      because: "the rule is written for window.postMessage, whose second argument is an origin",
      files: ["**/*.worker.ts"],
      rules: { "unicorn/require-post-message-target-origin": "off" },
    }),
    test.omit({
      because: "the JSX runtime marks every element call pure, which coverage reads as a branch",
      files: ["src/panel.tsx"],
    }),
  ],
});
```

Every package's config has the same four parts:

- one tier import,
- one namespace import per add-on,
- one `extends` list,
- one compiler config that lists the tier and then each add-on's fragment.

### Rule 1: Tiers live in one package

`@stealthscale/vite-config` keeps its five tier subpaths. Each subpath exports the same two names:

```ts
/**
 * The layers this tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[];

/**
 * Composes a config with this tier's layers under it.
 */
export const defineConfig: Defining;
```

Today `preset/workspace` exports `workspace()` and no `defineConfig`. A root takes the node tier's
`defineConfig` and adds `workspace()` by hand. Under this rule `preset/workspace` becomes a tier
like the other four:

```ts
// packages/vite-config/src/preset/workspace.ts
import { layers as node } from "#preset/node.ts";

/**
 * The layers a workspace root is built on. The node tier serves the linter, the formatter, and
 * the packages that have no config of their own. The rest are the layers only a root states.
 */
export function layers(): readonly Extendable[] {
  return [...node(), run.cache(), run.ci(), staged.checked(), staged.formatted(), test.projects()];
}

export const defineConfig: Defining = configuring(layers);
```

`@stealthscale/vite-config-react/preset/app` and `preset/web` are removed. They exist to stop a
consumer from pairing React with the wrong tier. The cost of that pairing was measured on
2026-09-16: under the node tier a rendering library loses `pack.platform(neutral)` and nothing else,
because the linter reads the root config and React sets its own test environment. A conformance
check on the example packages detects that one line.

### Rule 2: An add-on exports `layers()` and `workspace()`

An add-on package is a package that a repository adds beside a tier. React and the stylesheet checks
are add-ons today. Every add-on exports these two functions with these signatures:

```ts
/**
 * What this add-on states in a package's own config.
 */
export function layers(options?: Options): readonly Layer[];

/**
 * What this add-on states once, at the workspace root.
 *
 * Empty where the add-on has nothing for a root, so a root's config reads the same whichever
 * add-ons it lists.
 */
export function workspace(): readonly Layer[];
```

- The block namespaces an add-on exports today stay exported: `react.lint`, `react.fmt`,
  `react.test`, `react.plugin` and `react.federation`. A removal targets one layer inside them. A
  repository sometimes wants one layer without the rest.
- `preset.workspace()` moves to the top level as `workspace()`.
- In the stylesheet package, `plugin.check()` becomes `layers()`, `override.warn()` becomes
  `warn()`, and the `override` namespace is removed.
- An add-on states its layers under its own name and does not wrap them in `owned()`. The kernel
  keeps `owned()` for a repository that composes layers of its own. No house package calls it.

### Rule 3: A layer is named by the call that made it

The name of a layer is the path a consumer writes to call its factory, followed in parentheses by
the arguments that distinguish two calls of that factory. The factory path and the distinguishing
arguments are the whole name.

| Written                                         | Named                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `test.coverage()`                               | `test.coverage`                                                     |
| `server.port(4200)`                             | `server.port(4200)`                                                 |
| `server.reachable(["a.dev", "b.dev"])`          | `server.reachable(a.dev, b.dev)`                                    |
| `lint.relax({ files: ["**/*.spec.tsx"], ... })` | `lint.relax(**/*.spec.tsx)`                                         |
| `react.layers()`                                | `react.plugin.refresh`, `react.test.cleanup`, `react.test.document` |
| `react.lint.rendered()`                         | `react.lint.rendered`                                               |
| `css.layers()`                                  | `css.check`                                                         |

A factory that returns an array composes layers other factories made. Each layer in the array keeps
the name of its own factory, inside the same block. `react.layers()` returns `react.plugin.refresh`,
`react.test.cleanup` and `react.test.document`. `lint.preset.node()` returns `lint.node`.

Under this rule the React workspace layers compose to `react.fmt.imports`,
`react.lint.plugins(react)`, `react.lint.plugins(jsx-a11y)`, `react.lint.rules`,
`react.lint.runtime`, `react.lint.rendered` and `react.lint.fixtures`. The rules come before the
relaxations, because the linter applies overrides in order and the last override for a file is the
one in force.

A factory that builds its layer from another factory renames the result. The kernel gains one helper
for that:

```ts
/**
 * Gives a layer the name of the factory that returned it, where that factory built it from
 * another.
 *
 * `react.lint.rendered()` calls `lint.undocumented()` over the rendered specification globs.
 * Without this helper the layer is named `lint.relax(**/*.spec.tsx, **/*.fixtures.tsx)`, which
 * is a call the consumer never wrote.
 *
 * @typeParam Of - The kind of layer being renamed.
 * @param name - The name the consumer wrote.
 * @param layer - The layer another factory returned.
 * @returns The same layer under that name.
 */
export function named<Of extends Layer>(name: string, layer: Of): Of;
```

The implementation is the one minting call that `owned()` already makes, so the result keeps the
brand:

```ts
export function named<Of extends Layer>(name: string, layer: Of): Of {
  return mint<Of>({ ...layer, name });
}
```

These names in `vite-config` change under this rule:

| Today                                                  | Under the rule                                |
| ------------------------------------------------------ | --------------------------------------------- |
| `server.reachable`, `server.bound`                     | `server.reachable(...)`, `server.bound(...)`  |
| `preview.reachable`, `preview.bound`, `preview.shared` | the same names with their arguments           |
| `pack.hook(build:before)` from `buildBefore()`         | `pack.buildBefore`                            |
| `define.manifest`                                      | `define.manifest(commit)` where commit is set |

### Rule 4: A departure is a verb and takes one record

A departure is a layer whose `because` the caller supplies. It is a contribution, a removal or an
override. That is the line the kernel already draws. The rule has three parts:

- The factory of a departure is a verb in the imperative.
- The factory takes one record. The first field of the record is `because`.
- The list the departure acts on has the same field name in every block, chosen by what the list
  holds.

| The list holds  | Field      | Used by                                                                            |
| --------------- | ---------- | ---------------------------------------------------------------------------------- |
| Path globs      | `files`    | `lint.relax`, `lint.enforce`, `lint.forbid`, `fmt.skip`, `test.omit`, `deps.crawl` |
| Package names   | `deps`     | `deps.prebundle`, `ssr.bundle`                                                     |
| A rule map      | `rules`    | `lint.relax`, `lint.enforce`, `css.warn`                                           |
| Code to run     | `runs`     | `pack.buildPrepare`, `pack.buildBefore`, `pack.buildDone`                          |
| Import patterns | `patterns` | `lint.forbid`, `fmt.group`, `fmt.own`                                              |

A house layer is a noun. Its reason is written in its docblock, and the tier supplies its `because`.
`build.inventory`, `fmt.generated`, `react.plugin.refresh` and `css.check` keep their names. A
preset is a noun whoever states it. A preset sets a value and takes no reason.

These departures are renamed:

| Today                                | Under the rule                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| `deps.crawled({ because, from })`    | `deps.crawl({ because, files })`                                                       |
| `deps.prebundled({ because, deps })` | `deps.prebundle({ because, deps })`                                                    |
| `ssr.bundled({ because, deps })`     | `ssr.bundle({ because, deps })`                                                        |
| `test.uncounted({ because, files })` | `test.omit({ because, files })`                                                        |
| `fmt.internal(patterns)`             | `fmt.own({ because, patterns })`                                                       |
| `pack.buildBefore(because, runs)`    | `pack.buildBefore({ because, runs })`, and the same for `buildPrepare` and `buildDone` |
| `css.override.warn(checked)`         | `css.warn({ because, ...checked })`                                                    |

A preset that a repository states keeps positional arguments, with at most two of them, or one
record that describes one thing. Examples: `server.port(4200)`, `test.environment("node")`,
`run.task("docs", "vp build")`, `federation.host({ name, remotes, shared, stubs })`. Three presets
are renamed to nouns:

| Today                    | Under the rule             |
| ------------------------ | -------------------------- |
| `pack.ships(exports)`    | `pack.subpaths(exports)`   |
| `test.covering({ ... })` | `test.thresholds({ ... })` |
| `build.served(at)`       | `build.base(at)`           |

The names of `server.reached`, `preview.reached`, `staged.on` and `test.globalSetup` are open
questions.

### Rule 5: The options record of a departure is the participle of its verb

- `lint.relax` takes `Ruled`. `fmt.skip` takes `Skipped`. `fmt.group` takes `Grouped`. `deps.crawl`
  takes `Crawled`.
- Every departure follows this today except `test.globalSetup`, which takes `Global`.
- A preset's record is named for the thing it describes: `Hosted`, `Remoted`, `Browsed`, `Injected`.

### Rule 6: A compiler fragment composes like a layer

- `@stealthscale/vite-config-typescript` keeps `base.json`, `node.json` and `web.json` as the tiers.
- An add-on that changes compiler options publishes one fragment. The fragment has no `extends` of
  its own and is named for the tier it belongs beside.
- A consumer lists the tier first and the fragment after it, in the array form of `extends`.

The React fragment becomes:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

A probe with this repository's `tsc`, version 7.0.2, merged two files listed in array form into one
config that carried both `strict` and `jsx`. The array form is available at the version this
repository compiles with. Today `web.json` in the React package is a whole tier, and a consumer can
extend it without the base by mistake. A fragment cannot be extended that way.

### Rule 7: A plugin package has one factory, named for the plugin

- A plugin package exports one function that returns a Vite plugin.
- The plugin is built with `plugin()` from `@stealthscale/vite-plugin-base`.
- The plugin's `name` is `stealth:` followed by the factory's name.
- The options record is named for what the factory describes.
- The peer dependency is `vite`, taken from the peer catalog.

`@stealthscale/vite-plugin-sbom` follows every point except the record's name. Its record is
`Stated`, and the base package also exports a `Stated`, so two imports of `Stated` mean two things.
The plugin's record becomes `Described`.

### Rule 8: What is copied is imported

The plain configurations in `vite-config-core`, `vite-plugin-base` and `vite-plugin-sbom` import one
file by relative path:

```ts
// packages/plain.config.ts
import { type UserConfig } from "vite-plus";

/**
 * What the node tier states, written out for the three packages the tiers depend on.
 */
export const plain: UserConfig = { pack: { ... }, test: { ... } };
```

```ts
// packages/vite-config-core/vite.config.ts
import { defineConfig } from "vite-plus";

import { plain } from "../plain.config.ts";

export default defineConfig(plain);
```

- The config loader bundles a relative import. The file does not need a package or a pack step.
- The file is at `packages/plain.config.ts` and matches no workspace glob, because it is a file and
  not a directory.

### Rule 9: A package's relaxations are written beside the package

The linter and the formatter read the root config only, so every package-specific relaxation is
stated at the root. The thirteen examples have three relaxations between them today. Under this rule
a package that needs one writes it in its own directory as `vite.layers.ts`:

```ts
// packages/foo/vite.layers.ts
import { type Layer, lint } from "@stealthscale/vite-config";

/**
 * What the root states on this package's behalf.
 */
export const layers: readonly Layer[] = [
  lint.relax({ because: "...", files: ["packages/foo/src/**/*.worker.ts"], rules: { ... } }),
];
```

- The root imports the file by relative path and spreads `layers` into `extends`.
- The globs are written from the root, because the linter resolves them from the root.
- The reason is written next to the code it excuses.
- The root config grows by one import line per package, not by one layer per relaxation.

### Migration

1. `vite-config-core` gains `named()`. `vite-config` renames the factories in the tables above,
   gives `preset/workspace` a `defineConfig`, and puts the argument into every layer name. This is
   one minor release of each package.
2. `vite-config-react` and `vite-config-css` export `layers()` and `workspace()`, stop calling
   `owned()`, name their layers by rule 3, and delete the two React tier subpaths. This is one minor
   release of each package.
3. The root config, the thirteen examples and the two testing packages move to the new names in the
   same change. Every commit has one grammar.

We do not keep an old name as an alias. The consumers are the sibling repositories. Each one is
rewritten once when it moves into this monorepo. Every layer name in the React package changes. The
changeset of each package lists the old and new names side by side.

### Callers

Inside this repository:

- the root `vite.config.ts`,
- the seven example applications and the six example libraries,
- the `vite.config.ts` of each of the nine packages,
- the three READMEs with a block table,
- the specifications of every renamed factory.

Outside this repository: every `vite.config.ts` and `tsconfig.json` in the tooling, platform,
theming, ui, product and docs repositories. Their number is an open question.

## Alternatives considered

### Document the grammar and leave the code as it is

Write the rules above into the README of `vite-config` and hold new code to them in review.

**Why not:**

- The READMEs of three packages disagreed with their exports after five days.
- Without a check, the next package breaks the rule.
- The packages about to arrive were written by the same people who wrote the current four grammars.

### One factory with options

Replace tiers and add-ons with one call, the way `antfu/eslint-config` exposes
`antfu({ typescript: true, react: true })` and returns a composer with `override()` and `append()`:

```ts
export default defineConfig(import.meta.dirname, { tier: "web", react: true, css: true });
```

**Why not:**

- An option bag hides which layers a package is built on.
- An option bag takes away removal by name. Removal by name is what lets a repository disagree with
  one house layer and keep the rest.
- The house already refuses option bags for those two reasons.
- The composer's `override()` is the same mechanism as this repository's removal and override
  layers, reached through a method instead of a list.

### Every add-on wraps every tier

Keep `vite-config-react/preset/app` and `preset/web`. Give the stylesheet package and every future
add-on the same subpaths, the way a Babel preset bundles plugins and other presets under one name.

**Why not:**

- Two add-ons cannot both wrap the tier a package extends. A package that renders and has
  stylesheets has to pick one add-on to wrap and add the other as a layer. That is the mixed form
  that exists today.
- Babel presets contain other presets. A tier here is a list a consumer imports once.

### One package

Fold the React and stylesheet packages into `vite-config` as subpaths, so there is one grammar
because there is one package.

**Why not:**

- The React plugin, `happy-dom` and the stylelint plugins would become peers of every consumer,
  including a node library with no rendering.
- The kernel was separated from the blocks because of the cost to a consumer of installing what it
  never calls. The same cost applies here.

### Ask a repository for a reason on every preset it states

Ask `test.thresholds`, `server.port` and `run.task` for a reason as well, so every layer a
repository states explains itself.

**Why not:**

- A reason asked of every layer is filled in by habit.
- A preset's argument is its reason. A port number says which port.
- The line between a value and a departure is the line the kernel draws between its kinds. This
  proposal keeps that line.

## Drawbacks

- The block package renames nine factories and three presets. Every layer name in the React package
  changes. A consumer that removes a React layer by name has to change the target string.
- Two subpaths are deleted from `vite-config-react`, and one namespace from `vite-config-css`.
- No alias bridges the two grammars. A consumer moves every name in one change.
- Every `vite.config.ts` in this repository changes: the root, thirteen examples and nine packages.
  Every configuration in the six sibling repositories changes when it arrives.
- The kernel's public API grows by one function.
- In every package that renders, `tsconfig.json` changes from one `extends` string to an array of
  two.
- A layer named by its arguments has a longer name wherever the argument is a list, and a removal
  has to quote the whole list.

## Answered questions

1. `server.reached` and `preview.reached` are `server.address` and `preview.address`. `staged.on` is
   `staged.command`. `test.globalSetup` is `test.prepare`. Each is a preset a repository states, and
   each name is the noun for what the preset sets.
2. `owned()` stays exported. No house package calls it, and a repository that composes layers of its
   own may.
3. `named()` takes the name first and the layer second. A delegating factory wraps its return value
   in one call, and its own signature does not change.

## Open questions

1. How many configuration files in the six sibling repositories import a React tier or remove a
   React layer by name?
2. Should a house contribution such as `build.inventory` become a preset? The merge concatenates
   `plugins` either way. A layer's kind would then say who stated it as well as how it merges.

## Unresolved and future work

- Discovering `vite.layers.ts` files from the root by glob, so a package's relaxations are picked up
  without an import line, is not proposed here.
- Deleting `owned()` from the kernel is not proposed here.
- A tier that refuses a layer from an add-on written for another tier is not proposed here. Under
  this proposal a rendering library under the node tier loses one line without a report.

## References

| What                                                        | Where                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Babel presets: naming, ordering, presets as functions       | https://babeljs.io/docs/presets                                                  |
| ESLint shareable configs: naming and exported arrays        | https://eslint.org/docs/latest/extend/shareable-configs                          |
| `antfu/eslint-config`: one factory, named presets, composer | https://github.com/antfu/eslint-config                                           |
| Vite+ monorepo guide: composing a root config by import     | `node_modules/vite-plus/docs/guide/monorepo.md`                                  |
| The composed layer names, measured on 2026-09-16            | `node --input-type=module -e` over the built packages, from `examples/app-react` |
| Array `extends` under tsc 7.0.2, measured on 2026-09-16     | a two-file probe under `/tmp/tsx`, `tsc -p --showConfig`                         |
