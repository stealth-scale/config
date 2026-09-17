# @stealthscale/example-theme-folio

`@stealthscale/example-theme-folio` states Folio: an editorial product, set to be read. A violet
brand on greys tinted to match, body text a step larger than the foundation's, a scale that climbs
by a major third, and a serif to read it in. It is a root theme, like Fathom, that also moves the
type.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-folio test
pnpm --filter @stealthscale/example-theme-folio build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`, which measures
every text pair at 7:1 and every line and ring at 3:1 against the page this theme draws. The other
specifications pin the scale, the faces, the palette and the shadows.

## The values

- `src/tokens.ts` redraws the grey with a trace of the violet and the violet itself, sets the type
  scale with `fontSizes(1.0625, 1.25)`, and sets the body and the headings in the system serif
  stack.
- `src/text-styles.ts` draws the text styles from the same two numbers with `typography`, so the
  leading and the tracking climb with the sizes. A text style is read at build time alone, so it
  goes into the preset and not into the switchable values.
- `src/semantic-tokens.ts` fills the contract. The page is at 98% lightness in light mode and 9% in
  dark mode, the primary palette points at the violet, and every shadow is cast with half again the
  default ink, because an editorial page shows few surfaces and each one is meant to lift off the
  paper. The corners are the foundation's.
- `src/index.ts` defines the theme from the three.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
