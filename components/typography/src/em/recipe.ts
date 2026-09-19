/**
 * Defines the styles an em element is drawn with.
 *
 * @remarks
 *   The base declares `fontStyle` rather than relying on the browser's default for the element.
 *   A theme can extend only a declaration the recipe makes, and a font family that ships no italic
 *   face needs an explicit substitute. The ink and the entrance are axes because a stressed run
 *   carries a status as often as a paragraph does, and a run revealed as a page loads is the same
 *   motion every other component reads.
 */

import { defineRecipe, motionVariants, toneVariants } from "@stealthscale/theme/authoring";

/**
 * Applies the italic style, in the ink the line is written in until a caller picks another.
 */
export const recipe = defineRecipe({
  base: { fontStyle: "italic" },
  className: "em",
  jsx: [/Em$/u],
  variants: {
    motion: motionVariants(["fade", "rise", "reveal"]),
    tone: toneVariants(),
  },
});
