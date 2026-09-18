/**
 * Defines the styles an em element is drawn with.
 *
 * @remarks
 *   The recipe declares `fontStyle` rather than relying on the browser's default for the element.
 *   A theme can extend only a declaration the recipe makes, and a font family that ships no italic
 *   face needs an explicit substitute. The recipe offers no variant axis.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Applies the italic style.
 */
export const recipe = defineRecipe({
  base: { fontStyle: "italic" },
  className: "em",
  jsx: [/Em$/u],
});
