/**
 * Binds the skeleton paragraph's recipe to the element that draws it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton-text/recipe.ts";

/**
 * Binds the recipe once, for the column the bars are drawn in.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);
