---
"@stealthscale/vite-config": minor
---

vite-config: name every layer for the call that made it, and import vite

- Every departure is a verb that takes one record whose first field is `because`. The array it acts
  on is `files`, `deps`, `rules`, `runs` or `patterns` in every block.
- `preset/workspace` exports `defineConfig` and `layers()` like the other four tiers. A root extends
  it directly.
- `peerDependencies` names `vite` and `vitest` from the peer catalog. `vite-plus` is not a peer.
- Every layer name carries the arguments that distinguish two calls: `server.reachable(a.dev)`,
  `preview.bound(127.0.0.1)`, `define.manifest(commit)`.
- `lint.defaultExported`, `lint.undocumented` and `lint.specified` return a layer named for their
  own call.
- Coverage counts every file under `src`, whether or not a test loaded it. `main.ts`, `main.tsx`,
  files under `bin` and worker files are left out as entry points.
- `engines.node` is `>=26.0.0`.
- `README.md` ships in the tarball, covering the five tiers, every block at the package root, and
  the four kinds of layer.
- `description` is a sentence naming what the package does.
- `test.browser()` imports `@vitest/browser-playwright` rather than
  `vite-plus/test/browser-playwright`. The provider is an optional peer, so the packer leaves the
  specifier external instead of inlining `vite-plus` and emitting a chunk that re-exports a package
  the consumer may not have installed.

| Before                                | After                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `deps.crawled({ because, from })`     | `deps.crawl({ because, files })`                                                       |
| `deps.prebundled({ because, deps })`  | `deps.prebundle({ because, deps })`                                                    |
| `ssr.bundled({ because, deps })`      | `ssr.bundle({ because, deps })`                                                        |
| `test.uncounted({ because, files })`  | `test.omit({ because, files })`                                                        |
| `test.globalSetup({ because, from })` | `test.prepare({ because, files })`                                                     |
| `test.covering({ ... })`              | `test.thresholds({ ... })`                                                             |
| `fmt.internal(patterns)`              | `fmt.own({ because, patterns })`                                                       |
| `pack.buildBefore(because, runs)`     | `pack.buildBefore({ because, runs })`, and the same for `buildPrepare` and `buildDone` |
| `pack.ships(exports)`                 | `pack.subpaths(exports)`                                                               |
| `build.served(at)`                    | `build.base(at)`                                                                       |
| `server.reached(port, names)`         | `server.address(port, names)`                                                          |
| `preview.reached(port, names)`        | `preview.address(port, names)`                                                         |
| `staged.on(files, runs)`              | `staged.command(files, runs)`                                                          |
| `pack.hook(build:before)` as a name   | `pack.buildBefore`                                                                     |
