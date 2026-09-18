/**
 * States what a stack is: children laid one after another along one direction, a semantic gap
 * apart, placed along that direction and across it.
 *
 * @remarks
 *   Every value is a semantic gap or a CSS alignment, so a theme moves the spacing of every stack
 *   by restating one scale. A row centres its children across the flow and a column stretches
 *   them, which is what a mark beside a word wants and what a column of panels wants, so the
 *   common stack states no alignment at all. The children are held to a minimum of nothing, so a
 *   long word inside one does not push the stack wider than the space it was given.
 */

import {
  alignVariants,
  defineRecipe,
  gapSizes,
  justifyVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a column at the middle gap until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: { display: "flex", flexDirection: "column", minInlineSize: "0" },
  className: "stack",
  defaultVariants: { gap: "md" },
  jsx: [/^Stack$/u],
  variants: {
    align: alignVariants(),
    direction: {
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: { alignItems: "center", flexDirection: "row" },
      "row-reverse": { alignItems: "center", flexDirection: "row-reverse" },
    },
    gap: gapSizes(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
    justify: justifyVariants(),
    wrap: { true: { flexWrap: "wrap" } },
  },
});
