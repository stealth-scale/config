/**
 * Extends the button for deep water: every label tracked wide.
 *
 * @remarks
 *   Nothing here names a class or a slot, because the recipe file in the component package
 *   decides both. The extension compiles under Abyss's attribute and applies nowhere else.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Tracks every button's label wide.
 */
export const extension: RecipeExtension = {
  base: { letterSpacing: "wide" },
};
