/**
 * Defines the styles a q element is drawn with.
 *
 * @remarks
 *   The base is empty. A quotation inside a line is drawn in the text around it, and the marks are
 *   the browser's, chosen for the language the element sits under. The class is the hook a theme
 *   extends to state other marks. The `marks` axis defaults to `auto`, so the recipe states the
 *   behaviour rather than leaving the element on the browser's initial value, and `none`
 *   suppresses the marks for a caller who writes the punctuation into the text. That is the case
 *   for a quotation already inside one.
 */

import { defineRecipe, motionVariants, toneVariants } from "@stealthscale/theme/authoring";

/**
 * Draws a quotation in the ink the line is written in, with the marks the browser chooses.
 */
export const recipe = defineRecipe({
  className: "quote",
  defaultVariants: { marks: "auto" },
  jsx: [/Quote$/u],
  variants: {
    /**
     * Whether the browser draws the marks for the language in force.
     */
    marks: {
      auto: { quotes: "auto" },
      none: { quotes: "none" },
    },

    motion: motionVariants(["fade", "rise", "reveal"]),
    tone: toneVariants(),
  },
});
