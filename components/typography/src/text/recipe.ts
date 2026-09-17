/**
 * States what a paragraph is: running text in a size, an ink, a weight and an alignment, cut to
 * one line where a caller asks, and moved or masked where a page wants it.
 *
 * @remarks
 *   Every value is a body role, a foreground role, a font weight token, an animation style or a
 *   layer style, so a theme moves all of them. A paragraph reads as the page reads until a caller
 *   picks a value, and the recipe is the key a theme extends every paragraph by. The base wraps
 *   the lines prettily, which keeps one word off the last line of a paragraph.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a paragraph in the middle body size until a caller says otherwise, and in the ink, the
 * weight and the alignment it inherits until a caller picks one. A motion enters it, and a mask
 * fades its bottom edge out, where a caller asks.
 */
export const recipe = defineRecipe({
  base: { textWrap: "pretty" },
  className: "text",
  defaultVariants: { size: "md" },
  jsx: [/Text$/u],
  variants: {
    align: {
      center: { textAlign: "center" },
      end: { textAlign: "end" },
      justify: { textAlign: "justify" },
      start: { textAlign: "start" },
    },
    mask: {
      bottom: { layerStyle: "mask.bottom" },
    },
    motion: {
      fade: { animationStyle: "fade.in" },
      reveal: { animationStyle: "reveal" },
      rise: { animationStyle: "rise" },
    },
    size: {
      lg: { textStyle: "body.lg" },
      md: { textStyle: "body.md" },
      sm: { textStyle: "body.sm" },
      xl: { textStyle: "body.xl" },
      xs: { textStyle: "body.xs" },
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
    weight: {
      bold: { fontWeight: "bold" },
      medium: { fontWeight: "medium" },
      normal: { fontWeight: "normal" },
      semibold: { fontWeight: "semibold" },
    },
  },
});
