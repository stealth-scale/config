/**
 * Binds the stress recipe to the element that draws it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. A recipe file that also bound one would put the runtime behind
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#em/recipe.ts";

/**
 * Binds the recipe once, for the stressed run of words.
 */
export const { withContext } = createRecipeContext(recipe);
