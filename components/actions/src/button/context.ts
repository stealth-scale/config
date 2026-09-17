/**
 * Binds the button's recipe to the elements that draw it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. A recipe file that also bound one would put the runtime behind
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#button/recipe.ts";

/**
 * Binds the recipe once, for the button, for the square that holds one glyph, and for whatever
 * sets their variants from above.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);
