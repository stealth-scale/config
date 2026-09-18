# @stealthscale/example-app-worker

The page in this example totals three amounts on a worker thread and prints what comes back. Vite
decides what to pre-bundle by following the imports reachable from the page, and no such walk
follows a worker started from a URL. This configuration adds the worker file to the list the scan
starts from, so the discovery happens during startup.

## Run it

```bash
pnpm --filter @stealthscale/example-app-worker dev
pnpm --filter @stealthscale/example-app-worker test
```

The page awaits the worker at the top level, so its module finishes evaluating once the total
arrives. That suits an example of three amounts. A page with anything else to paint needs a
different arrangement. The development server listens on port 4500 and the preview server on
port 4501.

## The configuration

`@stealthscale/vite-config/preset/app` supplies the worker settings, and this file adds three layers
to them.

- `deps.crawl()` adds `src/*.worker.ts` to `optimizeDeps.entries`, the set of files the dependency
  scan walks before the server starts serving. A dependency found only once the server is running
  forces a second optimise pass and a full page reload.
- `server.port(4500)` pins the development server and fails its start on a taken port.
- `preview.port(4501)` pins the preview server. `server.port` and `preview.port` set their ports
  independently, so the source and the build can run at once.

The tier supplies `worker.format()`. It emits every worker as a module rather than a classic script.
A classic worker cannot take a static import, so the bundler inlines everything it reaches into one
file and duplicates whatever the main bundle also uses. `src/main.ts` constructs the worker from
`new URL("./total.worker.ts", import.meta.url)`. The bundler recognises that form and rewrites it to
the hashed chunk name.

## The lint rule this package drops

`vite.layers.ts` exports one layer, and the workspace root configuration lists it in its own
`extends`:

```ts
import { layers as exampleAppWorker } from "./examples/app-worker/vite.layers.ts";
```

The layer turns `unicorn/require-post-message-target-origin` off for `src/*.worker.ts` and
`src/*.worker-client.ts`. That rule is written for `window.postMessage`, whose second argument is
the origin allowed to receive the message. A worker's `postMessage` takes a list of objects to
transfer instead, so these files have no second argument to give.

A `lint` layer written in this package's own `vite.config.ts` composes into the configuration and is
never read, because a linter reads the root configuration only. The globs in `vite.layers.ts` are
written from the repository root, which is where the rules are applied. Keeping the layer in a file
the root imports leaves the relaxation with the package it covers.
