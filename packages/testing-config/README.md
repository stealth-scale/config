# @stealthscale/testing-config

Reads a config or plugin package in a specification and returns every part of the house contract it
breaks, one sentence per breach.

```bash
pnpm add -D @stealthscale/testing-config
```

## One specification per package

```ts
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

describe("@stealthscale/vite-config-react", () => {
  it("keeps the config package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "config",
        module: await import("#index.ts"),
      }),
    ).resolves.toStrictEqual([]);
  });
});
```

A failure reads `manifest.files: files omits LICENSE` or
`layer.named: lint.rendered returns lint.relax(**/*.spec.tsx), which is not named for the call`.
Each sentence names the check, the thing and the expectation.

## Kinds

| Kind      | Checked on                                                              |
| --------- | ----------------------------------------------------------------------- |
| `library` | The manifest                                                            |
| `plugin`  | The manifest and the plugin factory                                     |
| `config`  | The manifest, the barrel, the README block table, the layers, the tiers |

## Options

| Option      | Holds                                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| `arguments` | The arguments each factory with required parameters is called with, keyed by path  |
| `tiers`     | The tier modules a config package publishes, keyed by subpath such as `preset/app` |
| `skip`      | The checks to leave out, each with a reason                                        |
| `only`      | The checks to run and no others. Reported as a violation when `CI` is set          |

A factory with required parameters and no entry in `arguments` is a violation. A tier subpath in the
manifest with no entry in `tiers` is a violation. Nothing is skipped without a report.

```ts
await violations({
  arguments: {
    "lint.relax": [{ because: "a reason", files: ["src/**"], rules: {} }],
    "server.port": [4200],
  },
  at,
  kind: "config",
  module: await import("#index.ts"),
  tiers: { "preset/app": await import("#preset/app.ts") },
});
```

## Checks

| Check              | Reports                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `manifest.exports` | A subpath whose file is missing, a conditional subpath without a source or a `dist` default, two maps that disagree |
| `manifest.files`   | A missing licence or README, an entry that does not exist, a published file no entry covers                         |
| `manifest.engines` | A node range that differs from the workspace root's                                                                 |
| `manifest.peers`   | A peer that is also a dependency, a `vite` or `vitest` peer not from the peer catalog, a peer on `vite-plus`        |
| `module.factories` | An export that is neither a function, a namespace nor a constant, a factory that cannot be called                   |
| `readme.exports`   | A block table that names a namespace the barrel lacks, or misses one it has                                         |
| `layer.kind`       | A factory that throws, a value shaped like a layer that is not one, an array mixing layers with other values        |
| `layer.named`      | A layer not named for the call a consumer writes, or carrying an owner prefix                                       |
| `layer.reasoned`   | A contribution, removal or override without a reason, or a preset with one                                          |
| `layer.unique`     | A factory that returns two layers under one name and kind                                                           |
| `tier.composes`    | A tier that is not supplied, lacks `layers()` or `defineConfig`, repeats a layer, or fails under a build            |
| `plugin.named`     | A barrel with no plugin, a plugin not named `stealth:<factory>`, a plugin without the two base hooks                |
| `plugin.peer`      | A plugin package without a `vite` peer                                                                              |

## How a layer is named

A factory that returns one layer names it for the call, with the arguments that distinguish two
calls in parentheses: `lint.relax(**/*.spec.tsx)`. A factory that returns an array composes layers
other factories made, and each of those keeps its own name inside the same block: `react.layers()`
returns `react.plugin.refresh`, and `lint.preset.node()` returns `lint.node`. The prefix comes from
the package name: `@stealthscale/vite-config-react` names its layers `react.…`, and
`@stealthscale/vite-config` names them with no prefix.

A top-level function other than `layers` and `workspace` is called only when `arguments` has an
entry for it. The kernel's minting functions re-exported from a barrel have none.

## Exports

| Export        | Kind                                         |
| ------------- | -------------------------------------------- |
| `violations`  | `(stated: Conformance) => Promise<string[]>` |
| `publishedOf` | Reads a manifest                             |
| `walked`      | Walks a barrel into factories and namespaces |
| `layersOf`    | Calls factories and sorts what they return   |
| `isLayer`     | Type guard for a layer                       |
| `prefixOf`    | The layer prefix of a package name           |

## Licence

MIT
