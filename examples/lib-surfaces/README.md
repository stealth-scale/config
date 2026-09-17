# @stealthscale/example-lib-surfaces

`@stealthscale/example-lib-surfaces` publishes one compound component, `Card`, drawn by a slot
recipe, and the preset that registers the recipe for an application's compiler. A component package
with a compound component is laid out this way: a recipe file that names every part, a context file
that binds the recipe once, one file per part that draws its slot through the binding, a namespace
that composes the parts, and a hand-written `src/theme.ts` that the theme testing kit checks against
the recipe files.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-surfaces test
pnpm --filter @stealthscale/example-lib-surfaces build
```

`vp test` runs three specifications. The recipe's asserts that no value in it is a color, a pixel
length or a color mode, through `recipeViolations` from `@stealthscale/testing-theme`. The preset's
asserts that every `*.recipe.ts` file under `src/` is registered under its class name, and a recipe
with slots under `slotRecipes`, through `presetViolations`. The component's renders the composition
into a happy-dom document, reads the classes each part was given, and checks the root against the
conformance contract of `@stealthscale/testing-react`.

## The recipe

`src/card/card.recipe.ts` states what a card is with `defineSlotRecipe` from
`@stealthscale/theme/authoring`. It names four slots, `root`, `header`, `content` and `footer`, and
two axes. The look axis sets the root's shadow, edge and surface. The size axis sets the root's
inset and gap and the header's heading, so the header carries a size class of its own. Every value
is a semantic token, a layer style or a text style, so a theme moves all.

## The classes

The compiler emits one class per slot and one per variant per slot, and the binding writes the same
names at run time:

| Element  | Classes                                                             |
| -------- | ------------------------------------------------------------------- |
| `Root`   | `card__root card__root--size-md card__root--variant-elevated`       |
| `Header` | `card__header card__header--size-md card__header--variant-elevated` |
| `Footer` | `card__footer card__footer--size-md card__footer--variant-elevated` |

The scheme is `block__element` for a slot and `block--axis-value` for a variant, the axis kept in
the modifier so a size of `sm` and any other axis with an `sm` never share a class. A theme
addresses one band at one size as `.card__header--size-lg`. The binding stamps `data-recipe` on the
root, which is the handle the theme testing kit finds the component by, and the kit finds each part
by its slot class.

## The component

`src/card/card.context.ts` binds the recipe once with `createSlotRecipeContext` from
`@stealthscale/theme`. `src/card/root.ts` draws an `article` through `withProvider`, which takes the
variants and hands them down. Each band draws its element through `withContext`, which reads them
and writes its own slot class. `src/card/namespace.ts` composes the four, and `src/index.ts`
publishes the namespace as `Card`, so a page writes `Card.Root`, `Card.Header`, `Card.Content` and
`Card.Footer`.

## The preset

`src/theme.ts` registers the recipe under the key `card` in `slotRecipes` with `definePreset`. The
file is the package's default export under `./theme`, which the house lint excuses from the rule
against default exports, because that is the file every build plugin reads a preset from.

## The configuration

```ts
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), theme.layers()] });
```

`react.layers()` adds the JSX transform, the happy-dom environment and the cleanup between tests.
`theme.layers()` contributes nothing. The preset is written by hand, and the specification reports a
recipe file it leaves out. It is listed so every package lists every add-on the same way.
