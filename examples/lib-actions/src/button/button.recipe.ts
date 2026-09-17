/**
 * States what a button is: an interactive control drawn in a look and a size, in the palette of
 * its status.
 *
 * @remarks
 *   Every value is a semantic token, a layer style or a text style, so a theme moves all of them.
 *   The looks read the palette's roles, and the status axis points the palette at an intent, so
 *   an error button and a primary button are one recipe.
 */

import {
  controlSizes,
  defineRecipe,
  interactive,
  lookVariants,
  stack,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a button: the hand and the focus ring, a row of its children, a corner of the middle
 * size, and the primary palette until a status says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    ...stack({ align: "center", direction: "row", gap: "gap.sm", justify: "center" }),
    borderRadius: "l2",
    colorPalette: "primary",
    display: "inline-flex",
    fontWeight: "medium",
    whiteSpace: "nowrap",
  },
  className: "button",
  defaultVariants: { size: "md", variant: "solid" },
  jsx: [/Button$/u],
  variants: {
    size: controlSizes(["sm", "md", "lg"]),
    status: statusVariants(),
    variant: lookVariants(["solid", "subtle", "outline", "ghost"]),
  },
});
