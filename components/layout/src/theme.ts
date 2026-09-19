/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as container } from "#container/recipe.ts";
import { recipe as divider } from "#divider/recipe.ts";
import { recipe as frame } from "#frame/recipe.ts";
import { recipe as grid } from "#grid/recipe.ts";
import { recipe as group } from "#group/recipe.ts";
import { recipe as spacer } from "#spacer/recipe.ts";
import { recipe as stack } from "#stack/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-layout",
  theme: {
    extend: {
      recipes: { container, divider, frame, group, spacer, stack },
      slotRecipes: { grid },
    },
  },
});
