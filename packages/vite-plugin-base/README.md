# @stealthscale/vite-plugin-base

`@stealthscale/vite-plugin-base` turns a name and one write step into a bundler plugin, and reports
the installed packages a finished build imported from. The write step takes the build as an argument
rather than as `this`, so an arrow function or a function two plugins share can serve as one. The
package list is read from the module graph, so a dependency the bundler dropped is absent from it
and one that arrived through another package is present.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-base
```

The package peers on `vite` 8 and `vitest` 4. Install both. `engines.node` is `>=26.0.0`.

## Usage

```ts
import { licensed, manifestAt, plugin, reached, text } from "@stealthscale/vite-plugin-base";

export function inventory() {
  return plugin({
    name: "example:inventory",

    writes(bundling, at) {
      const components = [...reached(bundling).values()].map((one) => ({
        licences: licensed(one.at).map((file) => file.named),
        named: one.named,
        version: text(one.manifest, "version"),
      }));

      bundling.emitFile({
        fileName: "inventory.json",
        source: JSON.stringify({ components, named: text(manifestAt(at) ?? {}, "name") }),
        type: "asset",
      });
    },
  });
}
```

Add the plugin this returns to `plugins` in a Vite configuration. `writes` runs at `generateBundle`,
where the module graph is complete and the output is not yet on disk. A file the write step emits
there becomes part of the bundle. The bundler awaits a promise the write step returns before it
closes the bundle.

## Reference

| Export       | Signature                                                    | What it returns                                    |
| ------------ | ------------------------------------------------------------ | -------------------------------------------------- |
| `plugin`     | `(stated: Stated) => Plugin`                                 | A plugin that writes once, at `generateBundle`     |
| `reached`    | `(bundling: Bundling) => ReadonlyMap<string, Reached>`       | Each package the build reached, keyed by directory |
| `owning`     | `(from: string) => string \| undefined`                      | The directory of the package a file belongs to     |
| `manifestAt` | `(at: string) => Manifest \| undefined`                      | The package.json parsed out of one directory       |
| `licensed`   | `(at: string) => readonly Licensed[]`                        | The licence files in a package's top directory     |
| `text`       | `(manifest: Manifest, field: string) => string \| undefined` | The field's value, when that value is a string     |

| Type       | What it describes                                                   |
| ---------- | ------------------------------------------------------------------- |
| `Bundling` | The build a bundler binds to `this` while it generates a bundle     |
| `Licensed` | One licence file, under `named` and `text`                          |
| `Manifest` | A parsed package.json, typed as `Readonly<Record<string, unknown>>` |
| `Plugin`   | Vite's own plugin type, re-exported                                 |
| `Reached`  | One package, under `at`, `dependsOn`, `manifest` and `named`        |
| `Stated`   | The description `plugin` takes, under `name` and `writes`           |

## The project directory

`at` is the directory the bundler resolved, recorded when Vite calls `configResolved`. Under a task
runner the working directory is the workspace root, so a plugin reading `process.cwd()` describes
the wrong package.

Note: rolldown defines no `configResolved` hook. A build that resolves no configuration hands the
write step the directory the process started in.

## Reading the graph

`reached` keys its answer by package directory, so two installs of one name are two entries. Four
kinds of module stay out of the result:

- A module outside `node_modules`. The test splits the path into segments, so a directory named
  `node_modules_old` is not mistaken for an install.
- A module with no package.json above it.
- A module whose nearest manifest does not parse, or parses to anything but an object.
- A module whose nearest manifest does not declare a `name`.

Every reader here answers undefined, or an empty result, where the file system refuses. One
dependency with an unreadable manifest costs the crawl an entry and never fails the build.

## Licence

MIT. See [LICENSE](LICENSE).
