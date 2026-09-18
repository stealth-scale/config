# @stealthscale/example-theme-fathom

`@stealthscale/example-theme-fathom` states Fathom, a deep teal product on marine greys, rounder
than the foundation and cast in its own hue. It shows how a theme package is laid out: a root theme
that fills the contract with the scales and states its values in files named for the category.
Nothing in it refers to a component.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-fathom test
pnpm --filter @stealthscale/example-theme-fathom build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every extension, every text pair at 7:1 and every line
and ring at 3:1, measured against the foundation the theme is layered on. The other specifications
pin what the theme changes.

`build` writes `dist/index.js`. The theme peers on `@stealthscale/theme` and imports its authoring
entry alone, so the runtime stays out of the bundle.

## The values

- `src/tokens.ts` redraws two ramps: the grey, tinted a little bluer than the product so a grey
  beside the teal reads as neutral, and the teal the product is drawn in.
- `src/semantic-tokens.ts` fills the contract. The page is at 96% lightness in light mode and 11% in
  dark mode, tinted between the greys and the product. Each hue palette reads its ramp by name with
  `paletteRoles`, each semantic palette points at a hue with `paletteAlias`, and the primary palette
  points at the teal. The corners are drawn from one rem with `radii`, and the shadows are cast in
  the neutral hue with `shadows`.
- `src/index.ts` defines the theme from the two.

The faces are the foundation's system stacks, so the manifest lists no font package.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here. It is listed so every package lists every add-on the same
way.
