/**
 * States what a text field is: a box a person types one line into, drawn in a look and a size.
 *
 * @remarks
 *   The surface, the edge, the ink, the placeholder, the focus ring and every state a field enters
 *   come from the theme's own field fragment, so a theme decides what a field looks like once for
 *   every field. What is left here is the shape, the size and which of three looks the edge takes.
 *   The size reads the control scale, so a field lines up with a button of the same name beside it
 *   and both move when a theme restates the scale. A field fills the width it is given rather than
 *   sizing itself to its content, because a row of fields of different widths reads as a form that
 *   was laid out by hand.
 *   The focus ring is drawn inside the box. A ring outside it would be clipped where a field sits
 *   flush against the edge of a panel, which is where fields usually sit.
 */

import { controlSizes, defineRecipe, field } from "@stealthscale/theme/authoring";

/**
 * Draws an outlined field at the middle size until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    ...field(),
    appearance: "none",
    borderRadius: "l2",
    textAlign: "start",
    width: "full",
  },
  className: "input",
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^Input$/u],
  variants: {
    size: controlSizes(),

    /**
     * How the edge of the field is drawn.
     */
    variant: {
      flushed: {
        background: "transparent",
        borderBlockEndColor: "border",
        borderColor: "transparent",
        borderRadius: "0",
        paddingInline: "0",
      },
      outline: { background: "bg.panel", borderColor: "border" },
      subtle: { background: "bg.muted", borderColor: "transparent" },
    },
  },
});
