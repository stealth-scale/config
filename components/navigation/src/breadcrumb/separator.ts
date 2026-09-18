/**
 * Draws the mark between two crumbs.
 *
 * @remarks
 *   A row of the list beside the crumbs rather than inside one, so a screen reader counting the
 *   list counts the crumbs and not the marks between them. It is hidden from the accessibility
 *   tree and carries a presentation role, because the trail's order is already in the list and a
 *   mark read out between every pair is noise. It turns around where the line runs right to left.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws the mark between two crumbs, saying nothing to a screen reader.
 */
export const Separator = withContext("li", "separator", {
  defaultProps: { "aria-hidden": true, role: "presentation" },
});

/**
 * Describes what a separator takes.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
