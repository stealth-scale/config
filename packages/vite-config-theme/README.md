# @stealthscale/vite-config-theme

`@stealthscale/vite-config-theme` adds the two theme plugins to a package's Vite configuration as
contributions beside its tier. `runtime()` adds the generator the design-system package runs, and
`stylesheet()` adds the compiler an application runs. A component package and a theme package add
`layers()`, which contributes nothing: each writes its preset or its theme by hand, and the theme
testing kit reports a file the hand-written list leaves out.

## Install

```bash
pnpm add -D @stealthscale/vite-config-theme
```

The package peers on `@stealthscale/vite-config-core`, `@stealthscale/vite-plugin-theme`, `vite` and
`vitest`. Install all four.

## Usage

The design-system package extends its tier with `runtime()`:

```ts
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), theme.runtime()] });
```

An application extends its tier with `stylesheet()`, and states its themes in `theme.config.ts`:

```ts
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet()],
});
```

A component package or a theme package lists `theme.layers()`, and a workspace root lists
`theme.workspace()`. Both contribute nothing, and both exist so every package lists every add-on the
same way.

Each contribution appends to Vite's `plugins` array and reads no key another layer sets, so its
position among the other add-ons changes nothing.

## Reference

| Export       | Signature                            | What it returns                           |
| ------------ | ------------------------------------ | ----------------------------------------- |
| `layers`     | `() => readonly Layer[]`             | An empty array                            |
| `runtime`    | `(stated?: Options) => Contribution` | One contribution named `theme.runtime`    |
| `stylesheet` | `(stated?: Options) => Contribution` | One contribution named `theme.stylesheet` |
| `workspace`  | `() => readonly Layer[]`             | An empty array                            |

`Options` is the plugin's, re-exported. Every field is optional, and the plugin's README lists them:
`include`, `layers` and `systemPackage`.

## Licence

MIT. See [LICENSE](LICENSE).
