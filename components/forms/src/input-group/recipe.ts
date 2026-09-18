/**
 * Defines the styles a field with a mark at one end or both is drawn with.
 *
 * @remarks
 *   Four parts. The root is the box the rest sit in, the field takes the typing, and the start and
 *   the end hold a mark each. The marks are drawn over the field rather than beside it, and the
 *   field reserves room for them, so the typing never runs underneath.
 *   The room is one custom property. The size axis writes it on the root as the control height of
 *   that step, and the marks axis reads it on whichever side a mark sits. Stating the room as a
 *   length per side and per step would be a compound for every pair of the two axes.
 *   A mark takes no pointer, so a press over one reaches the field behind it, and whatever the
 *   mark holds takes the pointer back. A decorative glyph that swallowed a press would leave part
 *   of the field dead to a pointer and working to a keyboard.
 *   The align axis pins a mark to the block start for a control that runs to several lines, where
 *   a mark centred against the whole box floats in the middle of it.
 */

import { defineSlotRecipe, onSlots, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * The custom property the field reads the room for a mark from.
 */
const INSET = "--input-group-inset";

/**
 * Writes what both marks share, since the two differ only in the end they sit at.
 */
const MARK = {
  "& > *": { pointerEvents: "auto" },
  color: "fg.muted",
  display: "inline-flex",
  justifyContent: "center",
  pointerEvents: "none",
  position: "absolute",
  top: "0",
  zIndex: "1",
};

/**
 * Draws a field with a mark at either end, at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    end: { ...MARK, insetInlineEnd: "0" },
    root: { display: "block", position: "relative", width: "full" },
    start: { ...MARK, insetInlineStart: "0" },
  },
  className: "input-group",
  defaultVariants: { align: "center", marks: "both", size: "md" },
  jsx: [/^InputGroup(\.\w+)?$/u],
  slots: ["root", "field", "start", "end"],
  variants: {
    /**
     * Where a mark sits against a control that runs to more than one line.
     */
    align: {
      center: {
        end: { alignItems: "center", blockSize: "full" },
        start: { alignItems: "center", blockSize: "full" },
      },
      start: {
        end: { alignItems: "start", blockSize: "full" },
        start: { alignItems: "start", blockSize: "full" },
      },
    },

    /**
     * Which ends of the field reserve room for a mark.
     */
    marks: {
      both: {
        field: { paddingInlineEnd: `var(${INSET})`, paddingInlineStart: `var(${INSET})` },
      },
      end: { field: { paddingInlineEnd: `var(${INSET})` } },
      start: { field: { paddingInlineStart: `var(${INSET})` } },
    },

    size: onSlots({
      end: sizeVariants((size) => ({ inlineSize: `control.${size}` })),
      root: sizeVariants((size) => ({ [INSET]: `{sizes.control.${size}}` })),
      start: sizeVariants((size) => ({ inlineSize: `control.${size}` })),
    }),
  },
});
