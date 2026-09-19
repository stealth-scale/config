/**
 * Defines the styles a strong element is drawn with.
 *
 * @remarks
 *   The weight is an axis rather than a base declaration, so a caller states which step of heavy
 *   an important run takes and a theme moves every step at once. The scale's `normal` step is left
 *   out. A run drawn at the weight of the text around it states nothing. The browser's `bolder`
 *   keyword is not read at all, because it resolves against the inherited weight and reaches a
 *   different step in each context.
 */

import {
  defineRecipe,
  motionVariants,
  toneVariants,
  weightVariants,
} from "@stealthscale/theme/authoring";

/**
 * Applies the semibold step until a caller picks another, in the ink the line is written in.
 */
export const recipe = defineRecipe({
  className: "strong",
  defaultVariants: { weight: "semibold" },
  jsx: [/Strong$/u],
  variants: {
    motion: motionVariants(["fade", "rise", "reveal"]),
    tone: toneVariants(),
    weight: weightVariants(["medium", "semibold", "bold"]),
  },
});
