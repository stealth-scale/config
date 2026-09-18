/**
 * Draws the box a table too wide for the page scrolls inside.
 *
 * @remarks
 *   The element is `div` and it holds `tabIndex` at zero, because a region that scrolls has to be
 *   reachable by a keyboard. WCAG 2.1.1 fails a table a pointer can scroll and a keyboard cannot,
 *   and it is the failure a table component is most often reported for.
 *   Name it. A focusable box with no name is announced as nothing at all, so point
 *   `aria-labelledby` at the caption's `id` or state `aria-label`.
 *   The scroller states the variants, not the table, because the look of the edge and the corner
 *   belong to the box that clips them.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#table/context.ts";

/**
 * Scrolls the table sideways, and states the variants every part reads.
 */
export const Scroller = withProvider("div", "scroller", { defaultProps: { tabIndex: 0 } });

/**
 * Describes what the box takes: the recipe's variants, and everything a styled div takes.
 */
export type ScrollerProps = ComponentProps<typeof Scroller>;
