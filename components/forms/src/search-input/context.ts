/**
 * Binds the search field's recipe to the elements that draw its parts.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#search-input/recipe.ts";

/**
 * Binds the recipe once. The root provides the size and the other parts read it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
