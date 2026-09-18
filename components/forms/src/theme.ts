/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as field } from "#field/recipe.ts";
import { recipe as fieldset } from "#fieldset/recipe.ts";
import { recipe as inputGroup } from "#input-group/recipe.ts";
import { recipe as input } from "#input/recipe.ts";
import { recipe as searchInput } from "#search-input/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-forms",
  theme: {
    extend: { recipes: { input, searchInput }, slotRecipes: { field, fieldset, inputGroup } },
  },
});
