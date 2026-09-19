/**
 * Binds the command palette's recipe to the elements that draw its parts.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. Apart from the state, because the recipe decides how a part is
 *   drawn and the state decides what is left to draw.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#command/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
