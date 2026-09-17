/**
 * Extends the button for a console: labels set in capitals and tracked a little wider, and the
 * hero of a page raised off it.
 *
 * @remarks
 *   A console reads its buttons at a glance from across a row of them, and a capital label holds
 *   its width when the text changes. Nothing here names a class or a slot, because the component
 *   owns both, and the compound is matched on the selection the component named `hero`.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Sets every button's label in capitals, tracked wide, and raises the large solid button.
 */
export const extension: RecipeExtension = {
  base: { letterSpacing: "wide", textTransform: "uppercase" },
  compoundVariants: [{ css: { boxShadow: "xl" }, size: "lg", variant: "solid" }],
};
