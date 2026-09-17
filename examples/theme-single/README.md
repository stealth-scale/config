# @stealthscale/example-theme-single

`@stealthscale/example-theme-single` renders a page drawn by the button of
`@stealthscale/example-lib-actions` in one theme, Fathom, and switches its color mode. An
application with one theme is the smallest themed application there is. `theme.config.ts` lists the
theme. A stylesheet import is answered by the build plugin. One attribute on the document root
switches the color mode, and the page writes it. The theme attribute is never written, because the
one theme is the default.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-single dev
pnpm --filter @stealthscale/example-theme-single test
```

The development server answers on port 4800. `vp test` runs two specifications.
`theme.config.spec.ts` drives the stylesheet plugin the way a build would, with the drivers of
`@stealthscale/testing`, and reads the stylesheet it compiled from the real theme and the real
recipe: the theme's values where no attribute is set and under its attribute as well, the dark
values under the color mode attribute, the button's rules, and no mention of the compiler.
`app.spec.tsx` renders the page into a happy-dom document, switches the color mode, and reads the
attribute back off the document root.

## The statement

```ts
export default { themes: [fathom] } satisfies Application;
```

The one theme is the default. It is compiled under `[data-theme=fathom]` as well, which costs
nothing while no page writes the attribute, and lets a second theme join the list later without a
change to the page.

## The page

`src/app.tsx` keeps the color mode in state and writes it onto the document root in an effect, under
`COLOR_MODE_ATTRIBUTE` from `@stealthscale/theme`. The buttons are written with literal variants,
which is what the compiler extracts the rules for. The page's own layout is written with `css` from
the same package, reading the semantic spacing and the text styles a recipe reads, so the theme
moves the page as it moves the buttons. `src/main.tsx` imports `@stealthscale/theme/styles.css`
before the application, and the build plugin appends the compiled rules to it.

## The configuration

```ts
import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet(), server.port(4800)],
});
```

`theme.stylesheet()` adds the compiler. It reads `theme.config.ts`, walks the dependency graph for
every package publishing `./theme`, and compiles one stylesheet from the foundation, the component
package's preset and the theme. The statement is a default export, which the house lint excuses for
every `*.config.ts` file, and the shared `tsconfig.json` compiles it and its specification beside
`src`, so the application states nothing of its own for either.
