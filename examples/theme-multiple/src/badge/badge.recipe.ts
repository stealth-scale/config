/**
 * States what a badge is: a short label in the accent palette, drawn in a look.
 *
 * @remarks
 *   A recipe written in the application rather than in a component package, to show how one is
 *   registered: the application states its preset in `theme.config.ts`, and a theme extends the
 *   recipe by its key as it extends any other. Every value is a semantic token or a text style,
 *   so a theme moves all of them.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a badge: a small rounded label in the accent palette, subtle until a caller says
 * otherwise.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    borderRadius: "l1",
    colorPalette: "accent",
    display: "inline-flex",
    fontWeight: "medium",
    paddingInline: "inset.xs",
    textStyle: "label.sm",
    whiteSpace: "nowrap",
  },
  className: "badge",
  defaultVariants: { variant: "subtle" },
  jsx: [/Badge$/u],
  variants: {
    variant: {
      solid: { background: "colorPalette.solid", color: "colorPalette.contrast" },
      subtle: { background: "colorPalette.subtle", color: "colorPalette.fg" },
    },
  },
});
