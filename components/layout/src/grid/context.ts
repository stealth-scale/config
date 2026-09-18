/**
 * Binds the grid's recipe to the parts that draw it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. The root carries the variants, and every entry below it reads
 *   its classes from the root through a context.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#grid/recipe.ts";

/**
 * Binds the recipe once: the root takes the variants, and each entry draws its slot in them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
