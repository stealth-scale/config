/**
 * States what a divider is: one line drawn between things, along a page or down a row.
 *
 * @remarks
 *   The line is the foundation's, so a theme that moves what a boundary is drawn in moves every
 *   divider with it. The element carries the line on one edge rather than on all four, which is
 *   why the orientation is an axis and not a size.
 */

import { defineRecipe, divider } from "@stealthscale/theme/authoring";

/**
 * Draws a line across whatever holds it until a caller stands it up.
 */
export const recipe = defineRecipe({
  base: { borderWidth: "0", flexShrink: "0", marginBlock: "0" },
  className: "divider",
  defaultVariants: { orientation: "horizontal" },
  jsx: [/^Divider$/u],
  variants: {
    orientation: {
      horizontal: divider("horizontal"),
      vertical: divider("vertical"),
    },
  },
});
