/**
 * Binds the stack's recipe to the element that draws it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. A recipe file that also bound one would put the runtime behind
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#stack/recipe.ts";

/**
 * Binds the recipe once, for the stack and for whatever sets its variants from above.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);
