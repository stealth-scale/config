# @stealthscale/vite-config

A layer for each part of a Vite+ config, and the tier a package is built on. Extends
[`@stealthscale/vite-config-core`](../vite-config-core), which composes layers. The blocks they
configure are defined here.

```bash
bun add -D @stealthscale/vite-config @stealthscale/vite-config-core
```

## Pick a tier

A package extends exactly one. Each is a subpath export whose `defineConfig` already carries the
layers that tier implies.

| Tier                 | For                                           |
| -------------------- | --------------------------------------------- |
| `./preset/base`      | Publishes, says nothing about where it runs   |
| `./preset/node`      | Publishes and runs on the console             |
| `./preset/web`       | Publishes and runs in a browser               |
| `./preset/app`       | Deployed rather than published                |
| `./preset/workspace` | A workspace root: no pack, no build, no tests |

```ts
import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200)],
});
```

`import.meta.dirname` is required, not optional. Under `vp test` the working directory is the
workspace root, and a config is bundled to a temporary file outside its own package before it runs,
so neither the process nor the stack can say which package is being configured.

## Blocks

Each is a namespace on the root export, holding the layers for one part of the config.

| Block        | Decides                                                         |
| ------------ | --------------------------------------------------------------- |
| `build`      | Output: sourcemaps, licences, manifest, preload, inventory      |
| `define`     | What is substituted into the bundle                             |
| `deps`       | Prebundling and what the crawl misses                           |
| `federation` | Module federation hosts and remotes                             |
| `fmt`        | Formatting: docblocks, imports, manifests, prose, style         |
| `layout`     | Where the page and its entry sit                                |
| `lint`       | The rule sets, and `relax` to turn one off with a reason        |
| `pack`       | Packing: entry, declarations, platform, hooks, inventory        |
| `preview`    | The preview server's port, host and reachability                |
| `resolve`    | Conditions, and the source condition workspaces resolve through |
| `run`        | Task caching and the CI task list                               |
| `server`     | The dev server's port, host, proxy and reachability             |
| `serving`    | What `server` and `preview` state in common                     |
| `ssr`        | What is bundled into the server build                           |
| `staged`     | What runs against staged files                                  |
| `test`       | Files, isolation, environment, coverage, projects               |
| `worker`     | The worker format                                               |

`lint` and `fmt` are read from the workspace root and nowhere else. Stated in a package's own config
they compose, merge, and are then never read.

## Departing from the house

Three of the four layer kinds need a `because`. It is not documentation — a layer that departs from
what the house already answered has to say why, at the call site, where the next reader is.

```ts
import { lint } from "@stealthscale/vite-config";

lint.relax({
  because: "the rule is written for window.postMessage, whose second argument is the origin",
  files: ["**/*.worker.ts"],
  rules: { "unicorn/require-post-message-target-origin": "off" },
});
```

## Types for `import.meta.env`

```json
{ "compilerOptions": { "types": ["@stealthscale/vite-config/globals"] } }
```

## Licence

MIT
