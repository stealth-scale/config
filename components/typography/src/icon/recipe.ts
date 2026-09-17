/**
 * States what an icon is: a mark drawn as vector artwork a caller hands in, at a size, in an ink,
 * moved where a page wants it, and flipped where the page reads right to left.
 *
 * @remarks
 *   Every value is a semantic icon size, a foreground role or an animation style, so a theme moves
 *   all of them. The component draws no artwork of its own. The inherit size follows the font
 *   size around the mark, which is what keeps a mark beside a word the height of the word, and
 *   the ink is the current colour until a caller picks a tone. A mark that points, an arrow or a
 *   chevron, is mirrored in a right-to-left page, and a mark that does not, a clock or a star, is
 *   not.
 */

import { defineRecipe, iconSizes } from "@stealthscale/theme/authoring";

/**
 * Draws a mark at the size of the text around it in the current colour until a caller says
 * otherwise, with no motion until a caller asks for one.
 */
export const recipe = defineRecipe({
  base: {
    color: "currentcolor",
    display: "inline-block",
    flexShrink: "0",
    verticalAlign: "middle",
  },
  className: "icon",
  defaultVariants: { size: "inherit" },
  jsx: [/Icon$/u],
  variants: {
    mirrored: {
      true: { _rtl: { transform: "scaleX(-1)" } },
    },
    motion: {
      float: { animationStyle: "float" },
      spin: { animationStyle: "spin" },
      twinkle: { animationStyle: "twinkle" },
    },
    size: {
      ...iconSizes(["xs", "sm", "md", "lg", "xl"]),
      inherit: { boxSize: "1em" },
    },
    tone: {
      current: { color: "currentcolor" },
      error: { color: "fg.error" },
      info: { color: "fg.info" },
      muted: { color: "fg.muted" },
      success: { color: "fg.success" },
      warning: { color: "fg.warning" },
    },
  },
});
