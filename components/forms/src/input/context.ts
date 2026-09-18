/**
 * Binds the field's recipe to the element that draws it.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#input/recipe.ts";

/**
 * Binds the recipe once, for the field and for whatever sets its variants from above.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);
