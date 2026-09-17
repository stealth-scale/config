# @stealthscale/example-theme-forge

`@stealthscale/example-theme-forge` states Forge: a warm, quick product for an operations console.
Cream surfaces and an amber brand, cast flatter than the foundation, with every button's label set
in capitals. It is a root theme that also extends a recipe, which is the one thing Fathom and Folio
leave out.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-forge test
pnpm --filter @stealthscale/example-theme-forge build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` with `button` named
as the one recipe key the workspace publishes. The gate measures every contrast pair against the
cream, reports an extension file under `src/recipes/` that `src/index.ts` does not list, and reports
an extension naming a key nothing publishes. One case runs the gate with no key at all, so the last
report is pinned.

## The values

- `src/tokens.ts` redraws the grey, tinted warm enough to sit under the amber without going green,
  and the amber the product is drawn in.
- `src/semantic-tokens.ts` fills the contract. The page is at 96% lightness in light mode and 14% in
  dark mode, the primary palette points at the amber, and warnings point at the yellow to stay apart
  from it. Every shadow is cast with half the default ink, because a dense screen draws many
  surfaces at once.
- `src/recipes/button.ts` extends the button: labels in capitals, tracked wide. The type refuses
  `className` and `slots` in an extension, because the recipe file in the component package decides
  both.
- `src/index.ts` defines the theme and lists the extension under the key `button`.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
