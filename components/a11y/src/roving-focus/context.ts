/**
 * Binds the group's recipe to the parts that draw it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. The root carries the orientation, and every item below it reads
 *   its classes from the root through a context.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#roving-focus/recipe.ts";

/**
 * Binds the recipe once: the root takes the orientation, and each item draws its slot in it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
