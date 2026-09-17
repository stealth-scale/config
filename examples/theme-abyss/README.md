# @stealthscale/example-theme-abyss

`@stealthscale/example-theme-abyss` states Abyss: Fathom taken into deep water. It is a derived
theme. It names Fathom as the theme it extends, states the pages, two palettes, the corners and one
button extension, and inherits everything else, the inks, the shadows and the other palettes
included.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-abyss test
pnpm --filter @stealthscale/example-theme-abyss build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` with `button` named
as the one recipe key the workspace publishes. The gate measures every contrast pair against the
deeper pages, and reads the whole theme, Fathom's values and Abyss's own together, because a derived
theme's values are merged over its parent's when it is defined. The other specifications pin what
Abyss states and what it inherits.

## The values

- `src/semantic-tokens.ts` places the page at 93% lightness in light mode and 6% in dark mode,
  points the primary palette at the indigo and the accent at the teal, and draws the corners from
  half a rem.
- `src/recipes/button.ts` tracks every button's label wide.
- `src/index.ts` defines the theme with `extends: fathom`, which nests Fathom's preset beneath
  Abyss's own so the compiler composes the lineage, and lists the extension under the key `button`.

Abyss depends on Fathom at run time, because the theme object it extends is imported, and peers on
`@stealthscale/theme` like every theme.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
