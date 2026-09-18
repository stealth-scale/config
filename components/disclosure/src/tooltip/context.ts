/**
 * Binds the tooltip's recipe to the elements that draw its parts.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. The content provides the variants rather than a root, because
 *   the machine draws no root and the content is the part a caller sizes.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#tooltip/recipe.ts";

/**
 * Binds the recipe once. The content provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
