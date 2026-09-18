/**
 * Binds the skip link's recipe to the parts that draw it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. Neither part takes a variant, so each is bound on its own
 *   rather than one providing for the other: a page puts the link at the top and the target
 *   further down, and the two are never nested.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skip-nav/recipe.ts";

/**
 * Binds the recipe once, for the link and for the target it jumps to.
 */
export const { withProvider } = createSlotRecipeContext(recipe);
