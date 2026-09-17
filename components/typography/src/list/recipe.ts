/**
 * States what a list is: a column of entries the browser marks or the caller marks, at a gap,
 * with each entry's mark aligned to its lines, entering with a motion where a page wants one.
 *
 * @remarks
 *   Every value is a semantic gap, a semantic inset, a foreground role or an animation style, so
 *   a theme moves all of them. The root takes the variants and every part draws its slot in them.
 *   The marker look restores the browser's markers, which the compiler's reset removes, and the
 *   plain look leaves each entry a row so an indicator of the caller's own sits beside the text.
 *   Which element the root draws is the whole of the difference between a bulleted and a numbered
 *   list, and a caller chooses it with `as`.
 */

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a list with the browser's markers at the middle gap until a caller says otherwise, with
 * no motion until a caller asks for one.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      display: "inline-block",
      flexShrink: "0",
      marginInlineEnd: "gap.xs",
      verticalAlign: "middle",
    },
    item: { display: "list-item", whiteSpace: "normal" },
    root: { display: "flex", flexDirection: "column" },
  },
  className: "list",
  defaultVariants: { gap: "md", variant: "marker" },
  jsx: [/^List(\.\w+)?$/u],
  slots: ["root", "item", "indicator"],
  variants: {
    align: {
      center: { item: { alignItems: "center" } },
      end: { item: { alignItems: "flex-end" } },
      start: { item: { alignItems: "flex-start" } },
    },
    gap: {
      lg: { root: { gap: "gap.lg" } },
      md: { root: { gap: "gap.md" } },
      sm: { root: { gap: "gap.sm" } },
      xl: { root: { gap: "gap.xl" } },
      xs: { root: { gap: "gap.xs" } },
    },
    motion: {
      reveal: { item: { animationStyle: "reveal" } },
      rise: { item: { animationStyle: "rise" } },
    },
    variant: {
      marker: {
        item: { _marker: { color: "fg.muted" } },
        root: { listStyle: "revert", paddingInlineStart: "inset.lg" },
      },
      plain: {
        item: { alignItems: "flex-start", display: "inline-flex" },
      },
    },
  },
});
