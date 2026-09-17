/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as blockquote } from "#blockquote/recipe.ts";
import { recipe as code } from "#code/recipe.ts";
import { recipe as heading } from "#heading/recipe.ts";
import { recipe as icon } from "#icon/recipe.ts";
import { recipe as kbd } from "#kbd/recipe.ts";
import { recipe as list } from "#list/recipe.ts";
import { recipe as text } from "#text/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-typography",
  theme: {
    extend: {
      recipes: { code, heading, icon, kbd, text },
      slotRecipes: { blockquote, list },
    },
  },
});
