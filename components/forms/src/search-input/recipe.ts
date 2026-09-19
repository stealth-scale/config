/**
 * Defines the styles the control that empties a search field is drawn with.
 *
 * @remarks
 *   The one element this component adds. The box, the field and the room the field leaves at its
 *   end are the input group's, so the two components write one mechanism between them rather than
 *   the same one twice, and a theme that moves every grouped field moves this one.
 *   The control fills the mark it sits in, which the group sizes off the control scale, so the
 *   control and the field step together at every size.
 */

import { defineRecipe, iconOnly, interactive } from "@stealthscale/theme/authoring";

/**
 * Draws the control at the middle size until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    _hover: { color: "fg" },
    alignItems: "center",
    blockSize: "full",
    borderRadius: "l1",
    color: "fg.muted",
    display: "inline-flex",
    inlineSize: "full",
    justifyContent: "center",
  },
  className: "search-input",
  defaultVariants: { size: "md" },
  jsx: [/^SearchInput$/u],
  variants: { size: iconOnly() },
});
