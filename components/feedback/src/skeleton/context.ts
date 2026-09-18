/**
 * Binds the skeleton's recipe to the element that draws it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. A recipe file that also bound one would put the runtime behind
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton/recipe.ts";

/**
 * Binds the recipe once, for the skeleton, for the lines a paragraph of them draws, and for
 * whatever sets their variants from above.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);
