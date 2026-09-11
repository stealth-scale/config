# @stealthscale/vite-config-core

Defines a layer, and composes a list of them into one Vite+ config. Names no Vite key and knows no
block, so a package that only mints layers depends on this rather than on the entire toolchain.

```bash
pnpm add -D @stealthscale/vite-config-core
```

## Four kinds

| Function       | Kind         | What it does                 | When it runs                |
| -------------- | ------------ | ---------------------------- | --------------------------- |
| `preset()`     | Preset       | Sets a block                 | First, ordered by `enforce` |
| `contribute()` | Contribution | Appends one item to a list   | In the order written        |
| `remove()`     | Removal      | Takes any layer back by name | Reaches what is above it    |
| `override()`   | Override     | Rewrites the merged config   | Last                        |

Each is branded, so a bare object is never mistaken for a layer. Every kind carries a `name`, which
is what a `remove()` matches on. The three a repository states for itself also carry a `because`.

```ts
import { contribute, preset } from "@stealthscale/vite-config-core";

export function port(held: number) {
  return preset({ config: { server: { port: held } }, name: "server.port" });
}

export function setup(from: string) {
  return contribute({
    at: "test.setupFiles",
    because: "the kit installs its matchers at import time",
    item: from,
    name: `test.setup(${from})`,
  });
}
```

## Context

Every layer that needs to know what is being configured is handed a `Context` first, Go-style. It
extends Vite's `ConfigEnv` with four fields the kernel works out once so no block has to:

| Field      | What it holds                                                           |
| ---------- | ----------------------------------------------------------------------- |
| `at`       | The directory being configured, as declared                             |
| `root`     | The workspace root                                                      |
| `manifest` | That directory's `package.json`, with `workspaces` normalised           |
| `env`      | `.env` merged from the workspace root, then the package, then the shell |

```ts
import { preset } from "@stealthscale/vite-config-core";

preset({
  config: (context) => ({ build: { sourcemap: context.mode !== "production" } }),
  name: "build.sourcemaps",
});
```

## Composing

```ts
import { defineConfig } from "@stealthscale/vite-config-core";

export default defineConfig(import.meta.dirname, {
  extends: [port(4200), setup("./vitest.setup.ts")],
  server: { host: true },
});
```

`extends` is the only key this adds. Everything written beside it is an ordinary Vite+ config and
wins over what the layers decided.

The directory is declared rather than discovered, and `import.meta.dirname` is the only reliable
spelling: under a task runner the working directory is the workspace root, and a config is bundled
to a temporary file outside its own package before it runs.

## Exports

`contextOf`, `configuring`, `defineConfig`, `contribute`, `override`, `owned`, `preset`, `remove`,
and the types `Apply`, `Config`, `ConfigFn`, `Context`, `Contribution`, `Defining`, `Extendable`,
`Layer`, `Manifest`, `Override`, `Preset`, `Removal`, `Stated`.

## Licence

MIT
