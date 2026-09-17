/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here. A recipe that draws several parts is registered under
 *   `slotRecipes`, which the compiler reads apart from the recipes that draw one element.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as card } from "#card/card.recipe.ts";

export default definePreset({
  name: "@stealthscale/example-lib-surfaces",
  theme: { extend: { slotRecipes: { card } } },
});
