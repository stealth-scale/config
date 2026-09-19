/**
 * States what an icon is: a mark drawn as vector artwork a caller hands in, at a size, in an ink,
 * moved where a page wants it, and flipped where the page reads right to left.
 *
 * @remarks
 *   Every value is a semantic icon size, a foreground role or an animation style, so a theme moves
 *   all of them. The component draws no artwork of its own. The inherit size follows the font
 *   size around the mark, which is what keeps a mark beside a word the height of the word, and
 *   the ink is the current colour until a caller picks a tone. The fill follows the ink too,
 *   because a path with no fill of its own is drawn black by the browser, which vanishes on a dark
 *   surface; a path that states `fill="none"` keeps it. A mark that points, an arrow or a chevron,
 *   is mirrored in a right-to-left page, and a mark that does not, a clock or a star, is not.
 */

import {
  defineRecipe,
  iconSizes,
  motionVariants,
  toneVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a mark at the size of the text around it in the current colour until a caller says
 * otherwise, with no motion until a caller asks for one.
 */
export const recipe = defineRecipe({
  base: {
    color: "currentcolor",
    display: "inline-block",
    fill: "currentcolor",
    flexShrink: "0",
    verticalAlign: "middle",
  },
  className: "icon",
  defaultVariants: { size: "inherit" },
  jsx: [/Icon$/u],
  variants: {
    /**
     * Whether the mark turns around where the page reads right to left.
     *
     * @remarks
     *   Written as `scale` rather than as a `transform` function. The `spin` motion animates
     *   `transform`, and an animation overrides a declaration of the same property, so a mirrored
     *   mark that also spins lost its mirror for as long as it turned. The two are separate
     *   properties and compose.
     */
    mirrored: {
      true: { _rtl: { scale: "-1 1" } },
    },
    motion: motionVariants(["float", "spin", "twinkle"]),
    size: { ...iconSizes(), inherit: { boxSize: "1em" } },
    tone: {
      ...toneVariants(["muted", "info", "success", "warning", "error"]),
      current: { color: "currentcolor" },
    },
  },
});
