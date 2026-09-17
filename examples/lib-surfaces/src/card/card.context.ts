/**
 * Binds the card's recipe to the parts that draw it.
 *
 * @remarks
 *   One binding serves every part. The root takes the variants and provides them, and each band
 *   reads them from the provider and writes its own slot class beside them, so a band never takes
 *   a variant of its own.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#card/card.recipe.ts";

/**
 * Binds the recipe once: the provider for the root, the context for every band.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
