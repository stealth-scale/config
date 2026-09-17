/**
 * States what a heading is: a title set in a heading role, in an ink, with an effect and a motion
 * where a page wants them, cut to one line where a caller asks.
 *
 * @remarks
 *   Every value is a heading role, a foreground role, a text layer style or an animation style,
 *   so a theme moves all of them. The size axis names the heading roles and not the steps of the
 *   type scale. A heading states how loud it is. Which level it is stays with the element, where
 *   a screen reader reads it, and a caller changes the level with `as`. The shine effect carries
 *   the shimmer that moves it, because a shine that stands still is a gradient. The base balances
 *   the lines, so a heading that wraps breaks into even lines rather than leaving one word alone
 *   on the last.
 */

import {
  defineRecipe,
  motionVariants,
  textSizes,
  toneVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a heading in the large heading role until a caller says otherwise, in the ink it inherits
 * until a caller picks one, and with no effect and no motion until a caller asks for one.
 */
export const recipe = defineRecipe({
  base: { textWrap: "balance" },
  className: "heading",
  defaultVariants: { size: "lg" },
  jsx: [/Heading$/u],
  variants: {
    effect: {
      gradient: { layerStyle: "text.gradient" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },
    motion: motionVariants(["fade", "rise", "reveal"]),
    size: textSizes("heading"),
    tone: toneVariants(),
    truncate: { true: truncate() },
  },
});
