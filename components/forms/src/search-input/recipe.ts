/**
 * States what a search field is: a text field with a control at its end that empties it.
 *
 * @remarks
 *   Three parts. The root positions the control against the field, the field leaves room at its
 *   end so the typing never runs under that control, and the clear is the control itself. The
 *   field's own surface, edge and size are the text field's recipe, which this one does not
 *   restate: the field part here writes the room and nothing else.
 *   The room is a square the height of the control, which is exactly what the clear occupies, so
 *   the two read the same scale and stay lined up at every size. A field that reserved a fixed
 *   width would crowd its own text at the small end and leave a gap at the large one.
 */

import {
  defineSlotRecipe,
  iconOnly,
  interactive,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws the control against the end of the field, at the middle size until a caller says
 * otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    clear: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      insetInlineEnd: "0",
      justifyContent: "center",
      position: "absolute",
      top: "0",
    },
    root: { display: "block", position: "relative", width: "full" },
  },
  className: "search-input",
  defaultVariants: { size: "md" },
  jsx: [/^SearchInput$/u],
  slots: ["root", "field", "clear"],
  variants: {
    /**
     * How much room the field leaves at its end, which is the box the clear occupies.
     */
    size: onSlots({
      clear: iconOnly(),
      field: sizeVariants((size) => ({ paddingInlineEnd: `{sizes.control.${size}}` })),
    }),
  },
});
