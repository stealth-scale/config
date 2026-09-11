# @stealthscale/vite-plugin-base

A hook that takes the build as an argument rather than as `this`, and the set of installed packages
a build used. Every bundler plugin needs both, and both are easy to get subtly wrong.

Peers on `vite`. Vite's `Plugin` extends rolldown's, so a plugin written against this runs under
Vite, under rolldown, and under anything taking a rollup-shaped plugin.

```bash
pnpm add -D @stealthscale/vite-plugin-base
```

## Writing a plugin

```ts
import { plugin } from "@stealthscale/vite-plugin-base";

export function manifest() {
  return plugin({
    name: "example:manifest",
    writes(bundling, at) {
      bundling.emitFile({ fileName: "manifest.json", source: "{}", type: "asset" });
    },
  });
}
```

`writes` runs at `generateBundle`: the module graph is complete, so what the build reached is
knowable, and the output has not been written, so a file can still be added to it.

`at` is the directory the bundler resolved, taken from `configResolved`. Not `process.cwd()` — under
a task runner that is the workspace root, so a plugin reading it describes the wrong package.

## Reading the graph

```ts
import { reached } from "@stealthscale/vite-plugin-base";

for (const [at, one] of reached(bundling)) {
  console.log(one.named, one.manifest["version"], [...one.dependsOn]);
}
```

`reached()` answers every installed package the build touched, keyed by directory so two copies of
one name are two entries. From the graph, not from a manifest: a manifest names what was asked for,
including what the bundler dropped, and misses what arrived through something else — `scheduler`
comes in through React and appears in no application's manifest.

| Field       | Holds                                            |
| ----------- | ------------------------------------------------ |
| `at`        | The package's own directory, absolute            |
| `named`     | Its name                                         |
| `manifest`  | Its `package.json`                               |
| `dependsOn` | The directories of the packages it imported from |

A module with no manifest above it is passed over, as is anything outside `node_modules` — the
repository's own source is the thing being described rather than a component of it.

## Exports

| Export       | What it does                                                |
| ------------ | ----------------------------------------------------------- |
| `plugin`     | States a plugin, with the build handed over as an argument  |
| `reached`    | Every installed package the build reached                   |
| `owning`     | The directory of the package a file belongs to              |
| `manifestAt` | Reads a manifest, answering nothing where it cannot be read |
| `licensed`   | The licence files a package ships, as text                  |
| `text`       | Reads one text field out of a manifest                      |

Types: `Bundling`, `Licensed`, `Manifest`, `Plugin`, `Reached`, `Stated`.

## Licence

MIT
