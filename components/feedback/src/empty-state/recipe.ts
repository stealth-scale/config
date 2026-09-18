/**
 * States what an empty state is: the panel a page draws where there is nothing to show, holding a
 * mark, a heading and a line saying what would be here.
 *
 * @remarks
 *   Five parts, because each is styled and a caller composes them in whatever order a page wants.
 *   The root is the panel, the content centres what is inside it, the indicator draws the mark, and
 *   the title and the description carry the words.
 *   One axis moves all of them together. The room inside the panel, the gap in the content, the box
 *   of the mark and the size of the title each read the scale of the same name, so a small empty
 *   state in a side panel and a large one filling a page are one name apart. The description holds
 *   its size, because a line of explanation is read at the size the rest of the page is read at
 *   however big the panel is.
 */

import {
  defineSlotRecipe,
  gapSizes,
  iconSizes,
  insetSizes,
  onSlots,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Draws a centred panel at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
    },
    description: { color: "fg.muted", textStyle: "body.sm" },
    indicator: {
      "& svg": { boxSize: "100%" },
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      justifyContent: "center",
    },
    root: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      width: "full",
    },
    title: { fontWeight: "semibold" },
  },
  className: "empty-state",
  defaultVariants: { size: "md" },
  jsx: [/^EmptyState(\.\w+)?$/u],
  slots: ["root", "content", "indicator", "title", "description"],
  variants: {
    /**
     * How much room the panel takes, which every part steps with.
     */
    size: onSlots({
      content: gapSizes(),
      indicator: iconSizes(),
      root: insetSizes(),
      title: textSizes("heading"),
    }),
  },
});
