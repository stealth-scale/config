# @stealthscale/testing-theme

`@stealthscale/testing-theme` checks a theme, a recipe and a preset against the theme contract, and
reads what a recipe declares and what a rendered component drew. Each gate returns a list of
sentences rather than a verdict, so one assertion reports which role, pair, token or file broke the
contract.

## Install

```bash
pnpm add -D @stealthscale/testing-theme
```

The package peers on `@stealthscale/theme` and `vitest`. Install both.

## Usage

A theme package runs its theme through the gate, naming the preset it is layered on and the recipes
the workspace publishes:

```ts
import { describe, expect, it } from "vitest";

import actions from "@acme/actions/theme";
import { publishedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { fathom } from "#index.ts";

describe("fathom", () => {
  it("keeps the theme contract", () => {
    expect(
      violations(fathom, {
        at: import.meta.dirname,
        base: foundation,
        recipes: publishedRecipes(actions),
      }),
    ).toStrictEqual([]);
  });
});
```

A component package runs each recipe and its preset through the gate:

```ts
import { presetViolations, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#button/button.recipe.ts";
import preset from "#theme.ts";

expect(recipeViolations(recipe, { parts: anatomy.keys() })).toStrictEqual([]);
expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
```

A specification about a rendered component reads the classes on each element:

```ts
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

expect(recipeClasses(container, "button")).toContain(variantClass("button", "variant", "solid"));
```

## Reference

### `violations(theme, options)`

| Check                 | Reports                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `name.attribute`      | A name outside `[a-z][a-z0-9-]*`, which a page cannot write as the theme attribute                                                 |
| `contract.roles`      | A palette that leaves one of the twelve roles out, and a family that leaves one of its members out                                 |
| `contract.modes`      | A color stated in one mode and not the other                                                                                       |
| `contract.references` | A reference that points at a token nothing defines, or at itself                                                                   |
| `contract.extensions` | An extension naming a recipe key the workspace does not publish, or naming `className` or `slots`                                  |
| `contract.compounds`  | A compound for a selection the component's recipe declares no compound for, where `recipes` maps each key to its recipe            |
| `contract.listed`     | A file under `recipes/` or `slot-recipes/` exporting `extension` that the theme does not list, where `at` is given                 |
| `contract.styles`     | A text, layer or animation style that states nothing, and a text style without a `fontSize`                                        |
| `contrast.text`       | A text pair below 7:1: every ink on every surface, and each palette's `contrast` on its solids and its inks on its fills           |
| `contrast.boundary`   | A boundary pair below 3:1: the emphasized line and the subtle ink on every surface, and each palette's solid and lines on the page |
| `contrast.focus`      | A palette's `focusRing` below 3:1 on any surface                                                                                   |
| `fonts.installed`     | A font package the theme names that does not resolve from `at`, and nothing where `at` is not given                                |

`options.recipes` lists the recipe keys the workspace publishes, or maps each key to its recipe,
which adds the compound check. `publishedRecipes(...presets)` builds that map out of the presets the
component packages publish, so the list is the one an application installs rather than one written
out by hand. `options.base` names the preset the theme is layered on, which the resolver follows a
reference into. `options.thresholds` moves any of the three ratios. `options.skip` leaves a check
out, each with a reason.

### `recipeViolations(recipe, options)`

| Check               | Reports                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipe.className`  | A class name outside `[a-z][a-z0-9-]*`                                                                                                                                                                                        |
| `recipe.colors`     | A color written outright, a ramp step, a reference, a hue, a palette role that does not exist, or `colorPalette` pointed at a hue                                                                                             |
| `recipe.tokens`     | A token the preset does not define, named by one word or by a path, in any category a property reads, and any composition name it does not define. A CSS-wide keyword and a size a box takes from its content are passed over |
| `recipe.conditions` | A condition neither the compiler's base preset nor the preset defines                                                                                                                                                         |
| `recipe.lengths`    | A length in `px`, `rem` or `pt` on a property outside `options.lengths`, the compiler's token function and a custom property's fallback left out                                                                              |
| `recipe.modes`      | `_dark`, `_light`, `_osDark` or `_osLight` anywhere in the recipe                                                                                                                                                             |
| `recipe.slots`      | A slot `options.parts` stamps no part for, and a part no slot styles                                                                                                                                                          |
| `recipe.subtle`     | `fg.subtle` as a text color                                                                                                                                                                                                   |

The color properties and the category each property reads are taken from the compiler's base preset
at run time. The tokens and conditions are read from `options.preset`, which is the foundation
unless a theme package states its own.

### `presetViolations(preset, options)`

| Check               | Reports                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `preset.registered` | A `*.recipe.ts` file under `at` the preset does not register, and a key no recipe file defines |
| `preset.keys`       | A recipe registered under a key that is not its class name in camel case                       |
| `preset.slots`      | A slot recipe under `recipes`, and a recipe without slots under `slotRecipes`                  |

### Readers

| Export                                                                      | Reads                                                                                                                                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeClass`, `variantClass`, `slotClass`, `slotVariantClass`              | The classes a recipe emits, in the naming scheme of `@stealthscale/pandacss-naming`                                                                                          |
| `axesOf`, `valuesOf`, `defaultsOf`, `slotsOf`, `scaleOf`, `byStep`          | What a recipe declares, without rendering                                                                                                                                    |
| `recipeElement`, `slotElement`, `classesOf`, `recipeClasses`, `slotClasses` | What a rendered component drew, by `data-recipe` on the element a recipe was bound to and on the root of a compound component, and by `data-part` or `data-slot` on one part |
| `resolved`, `palettesOf`, `extendedRecipes`, `fontsOf`                      | What a theme states, with every reference followed                                                                                                                           |
| `publishedRecipes`                                                          | Every recipe the presets of the component packages register, keyed as they register it, for `options.recipes`                                                                |

## Licence

MIT. See [LICENSE](LICENSE).
