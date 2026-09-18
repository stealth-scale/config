/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as rovingFocus } from "#roving-focus/recipe.ts";
import { recipe as skipNav } from "#skip-nav/recipe.ts";
import { recipe as visuallyHidden } from "#visually-hidden/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-a11y",
  theme: { extend: { recipes: { visuallyHidden }, slotRecipes: { rovingFocus, skipNav } } },
});
