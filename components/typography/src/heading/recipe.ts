/**
 * States what a heading is: a title set in a heading role, in an ink, with an effect and a motion
 * where a page wants them, cut to one line where a caller asks.
 *
 * @remarks
 *   Every value is a heading role, a foreground role, a text layer style or an animation style,
 *   so a theme moves all of them. The size axis names the heading roles and not the steps of the
 *   type scale. A heading states how loud it is. Which level it is stays with the element, where
 *   a screen reader reads it, and a caller changes the level with `as`. The shine effect carries
 *   the shimmer that moves it, because a shine that stands still is a gradient.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a heading in the large heading role until a caller says otherwise, in the ink it inherits
 * until a caller picks one, and with no effect and no motion until a caller asks for one.
 */
export const recipe = defineRecipe({
  base: {},
  className: "heading",
  defaultVariants: { size: "lg" },
  jsx: [/Heading$/u],
  variants: {
    effect: {
      gradient: { layerStyle: "text.gradient" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },
    motion: {
      fade: { animationStyle: "fade.in" },
      reveal: { animationStyle: "reveal" },
      rise: { animationStyle: "rise" },
    },
    size: {
      "2xl": { textStyle: "heading.2xl" },
      "3xl": { textStyle: "heading.3xl" },
      "4xl": { textStyle: "heading.4xl" },
      lg: { textStyle: "heading.lg" },
      md: { textStyle: "heading.md" },
      sm: { textStyle: "heading.sm" },
      xl: { textStyle: "heading.xl" },
      xs: { textStyle: "heading.xs" },
    },
    tone: {
      default: { color: "fg" },
      error: { color: "fg.error" },
      info: { color: "fg.info" },
      inverted: { color: "fg.inverted" },
      muted: { color: "fg.muted" },
      success: { color: "fg.success" },
      warning: { color: "fg.warning" },
    },
    truncate: {
      true: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    },
  },
});
