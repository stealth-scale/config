# @stealthscale/vite-plugin-base

`@stealthscale/vite-plugin-base` holds what every plugin in this repository builds on. `plugin`
turns a name and one write step into a bundler plugin. The readers report the installed packages a
finished build imported from, the packages a manifest depends on, what an export map publishes, and
what the workspace lockfile pinned. `imported` loads a module through Vite under the application's
own export conditions, `literal` writes a value as source for a generated file, and the two writers
put a generated file on disk without waking the watcher.

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

A plugin that generates files rather than emitting them writes its own hooks and reads the rest of
this package from them:

```ts
import { dependencies, imported, literal, writeIfChanged } from "@stealthscale/vite-plugin-base";
import { type Plugin } from "vite";

export function registry(): Plugin {
  let root = process.cwd();
  let conditions: readonly string[] | undefined;

  return {
    name: "example:registry",

    configResolved(config) {
      root = config.root;
      conditions = config.ssr.resolve?.conditions;
    },

    async buildStart() {
      const publishing = dependencies(root).filter((one) => one.manifest["exports"] !== undefined);
      const entries = await Promise.all(
        publishing.map((one) => imported<{ default: unknown }>(one.named, { conditions, root })),
      );

      for (const { files } of entries) for (const file of files) this.addWatchFile(file);

      writeIfChanged(
        `${root}/node_modules/.registry.mjs`,
        `export default ${literal(entries.map((one) => one.module.default))};\n`,
      );
    },
  };
}
```

## Reference

| Export            | Signature                                                                                      | What it returns                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `plugin`          | `(stated: Stated) => Plugin`                                                                   | A plugin that writes once, at `generateBundle`                                                                   |
| `reached`         | `(bundling: Bundling) => ReadonlyMap<string, Reached>`                                         | Each package the build reached, keyed by directory                                                               |
| `dependencies`    | `(root: string) => readonly Dependency[]`                                                      | Each package reachable through `dependencies` from the manifest at `root`, once, placed after what it depends on |
| `packageAt`       | `(name: string, from: string) => string \| undefined`                                          | The directory of a package, resolved from the directory of the package depending on it                           |
| `resolvedOnGraph` | `(root: string, name: string) => string \| undefined`                                          | The entry of a package, resolved from the root or from any package on its graph                                  |
| `exportTarget`    | `(manifest: Manifest, subpath: string, conditions?: readonly string[]) => string \| undefined` | The target the export map names for the subpath under the conditions, as the manifest writes it                  |
| `imported`        | `<Module>(id: string, loading: Loading, server?: ViteDevServer) => Promise<Imported<Module>>`  | The module Vite resolved and evaluated, with the files behind it                                                 |
| `literal`         | `(value: unknown, path?: string) => string`                                                    | The source that reproduces the value. It throws for a function or an instance, naming the path                   |
| `locked`          | `(from: string) => ReadonlyMap<string, Installed>`                                             | What the nearest lockfile above `from` pinned, keyed by package name                                             |
| `owning`          | `(from: string) => string \| undefined`                                                        | The directory of the package a file belongs to                                                                   |
| `manifestAt`      | `(at: string) => Manifest \| undefined`                                                        | The package.json parsed out of one directory                                                                     |
| `licensed`        | `(at: string) => readonly Licensed[]`                                                          | The licence files in a package's top directory                                                                   |
| `text`            | `(manifest: Manifest, field: string) => string \| undefined`                                   | The field's value, when that value is a string                                                                   |
| `writeIfChanged`  | `(at: string, content: string) => boolean`                                                     | True when the file was written, false when it already held the content                                           |
| `emptyDir`        | `(at: string) => void`                                                                         | Nothing. The directory and everything under it are gone                                                          |

| Type         | What it describes                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `Bundling`   | The build a bundler binds to `this` while it generates a bundle                                 |
| `Dependency` | One package the walk reached, under `at`, `dependsOn`, `manifest` and `named`                   |
| `Imported`   | A module under `module`, beside the `files` its evaluation read                                 |
| `Installed`  | What a lockfile pinned for one package: `integrity`, `registry` and `resolution`, each optional |
| `Licensed`   | One licence file, under `named` and `text`                                                      |
| `Loading`    | Where an import resolves from, under `root`, and the `conditions` it resolves under             |
| `Manifest`   | A parsed package.json, typed as `Readonly<Record<string, unknown>>`                             |
| `Plugin`     | Vite's own plugin type, re-exported                                                             |
| `Reached`    | One package, under `at`, `dependsOn`, `manifest` and `named`                                    |
| `Stated`     | The description `plugin` takes, under `name` and `writes`                                       |

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

## Walking the dependencies

`dependencies` starts at the manifest in `root` and reads `dependencies` alone: a peer is installed
by whoever depends on the package, and a development dependency is the package's own business. Each
package is resolved from the package that names it, the way Node resolves it, so a package is found
where the package manager put it for that dependent. A package that is not installed is passed over.
The result places a package after every package it depends on, which is the order a consumer needs
when a later contribution has to win over an earlier one. Two packages depending on each other are
placed in the order they were met.

`resolvedOnGraph` resolves one package's entry the same way, from the root first and then from each
package on the graph, which finds a package that only a dependency declares.

## Reading an export map

`exportTarget` reads the target a manifest publishes a subpath as, under the conditions given in
order and under `default` after them. A string export map is the `.` subpath. A map whose keys are
conditions rather than subpaths is the `.` subpath as well. A plugin reads an export map where it
has to name a file rather than import it: to write a path into a generated file, or to load a
package's own subpath from inside that package.

## Importing through Vite

`imported` resolves and evaluates a module under the conditions in `loading.conditions`, so a
workspace package that publishes its source under a condition of its own answers with the source
rather than with built output Node would pick. With a dev server whose `ssr` environment is
runnable, the import goes through that runner and joins the server's module graph, so an edit to any
file behind the module reaches the plugin as a hot update. Without one, an environment of the
function's own is built for the one import and closed afterwards. `files` lists every file the
evaluation read, the module's own first, which is what a plugin hands to `addWatchFile`.

## Reading the lockfile

`locked` climbs from a directory to the nearest ancestor holding a lockfile it recognises, reads
`bun.lock` first and `pnpm-lock.yaml` second, and returns what the file pinned for each package: the
integrity the manager checked the download against, the registry where it was not the default one,
and the version or the reference that stands where a version would. A lockfile that is missing or
does not parse yields an empty map and never fails a build.

## Writing generated files

`literal` writes a string, a number, a boolean, null, undefined, a regular expression, an array or a
plain object as the source that reproduces it, and refuses a function, an instance of a class, a
symbol or a bigint, naming the path where the value is. `writeIfChanged` compares the content with
what is on disk and writes only on a difference, which keeps a watcher from chasing a plugin's own
output round a loop. `emptyDir` clears a generated directory before a generator runs again, and does
nothing when the directory is absent.

## Licence

MIT. See [LICENSE](LICENSE).
