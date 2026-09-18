/**
 * States what a set of controls under one tab stop is: a row or a column of items, laid out the
 * way the arrows move through them.
 *
 * @remarks
 *   The orientation is one axis because it decides two things that have to agree: which arrows
 *   move focus, which the root reads, and which way the items run, which the recipe draws. A group
 *   the arrows move through in both directions wraps, because a set a reader moves through on two
 *   axes is a set that runs onto a second line.
 */

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

/**
 * Lays the items out in a row the arrows run along until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: { item: { minInlineSize: "0" }, root: { display: "flex" } },
  className: "roving-focus",
  defaultVariants: { orientation: "horizontal" },
  jsx: [/^RovingFocus(\.\w+)?$/u],
  slots: ["root", "item"],
  variants: {
    orientation: {
      both: { root: { flexDirection: "row", flexWrap: "wrap" } },
      horizontal: { root: { flexDirection: "row" } },
      vertical: { root: { flexDirection: "column" } },
    },
  },
});
