/**
 * Binds the blockquote's recipe to the parts that draw it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. The root carries the variants, and every part below it reads
 *   its classes from the root through a context.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#blockquote/recipe.ts";

/**
 * Binds the recipe once: the root takes the variants, and each part draws its slot in them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
