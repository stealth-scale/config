# @stealthscale/example-theme-multiple

`@stealthscale/example-theme-multiple` renders a page drawn by the button of
`@stealthscale/example-lib-actions` and switches it between four themes and two color modes. An
application with more than one theme is three things beside its pages. `theme.config.ts` lists the
themes. A stylesheet import is answered by the build plugin. The document root carries the theme
attribute and the color mode attribute, and `ThemeProvider` writes both.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-multiple dev
pnpm --filter @stealthscale/example-theme-multiple test
```

The development server answers on port 4700. `vp test` runs two specifications.
`theme.config.spec.ts` drives the stylesheet plugin the way a build would, with the drivers of
`@stealthscale/testing`, and reads the stylesheet it compiled from the real themes and the real
recipe: the first theme's values where no attribute is set, every theme's values under its
attribute, the button's rules, Forge's extension under Forge's attribute alone, and no mention of
the compiler. `app.spec.tsx` renders the page into a happy-dom document, picks a theme and a color
mode, and reads the attributes back off the document root.

## The statement

```ts
export default { themes: [fathom, folio, forge, abyss] } satisfies Application;
```

The first theme is the default. Each of the four is compiled under `[data-theme=<name>]` as well, so
a subtree can wear any of them. Abyss is derived from Fathom, and the compiler composes the lineage,
so Fathom's values and Abyss's own both compile under Abyss's attribute. One panel wears Forge while
the page wears whatever the reader picked.

## The page

`src/app.tsx` keeps the theme and the color mode in state and hands both to `ThemeProvider` from
`@stealthscale/theme`, which writes them onto the document root. The buttons are written with
literal variants, which is what the compiler extracts the rules for. The page's own layout and the
two panels are written with `css` from the same package, reading the semantic surfaces, spacing and
text styles a recipe reads, so every theme moves the page as it moves the buttons. The candy panel
is dressed in a moving border swept by `sweep`, a heading in `text.shine` moved by `shimmer`, a
glowing button, a breathing one, a rippling one, and a marquee that fades at both edges and rises
into view as the page scrolls. Two sections below it show the rest. The looks are a heading in
`text.gradient`, a card of `glass` over a drifting aurora, the three glows and the three blurs on
chips, a paragraph under `mask.bottom`, a grid under `mask.radial`, and a tile under
`backdrop.spotlight` whose handler writes the pointer's position into the two custom properties the
look reads. The motions are a bar along the top of the viewport that `progress` fills with the
scroll, a chip under `float`, a ring under `spin`, three dots under `twinkle`, a `meteor` across a
dark sky, stripes under `parallax` behind a pane, and a list under `rise` that runs again from a
button by mounting under a new key. All of it is drawn in whichever palette the theme points at, and
all of it holds still under `prefers-reduced-motion`. Below them a bento of five tiles, two of them
spanning, each on a backdrop of its own, dims the others while one is hovered. The switches stick to
the top of the page while the rest scrolls past. `src/main.tsx` imports
`@stealthscale/theme/styles.css` before the application, and the build plugin appends the compiled
rules to it.

## The configuration

```ts
import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet(), server.port(4700)],
});
```

`theme.stylesheet()` adds the compiler. It reads `theme.config.ts`, walks the dependency graph for
every package publishing `./theme`, and compiles one stylesheet from the foundation, the component
package's preset and the three themes. The statement is a default export, which the house lint
excuses for every `*.config.ts` file, and the shared `tsconfig.json` compiles it and its
specification beside `src`, so the application states nothing of its own for either.
