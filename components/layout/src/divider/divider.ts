/**
 * Draws a divider through its recipe.
 *
 * @remarks
 *   The element is `hr`, which a browser already gives the separator role, so a reader is told
 *   that what follows is apart from what came before. A divider drawn down a row states that it
 *   runs the other way with `aria-orientation`, which the element's role takes.
 */

import { type ComponentProps } from "react";

import { withContext } from "#divider/context.ts";

/**
 * Draws one line between things, across the page or down a row.
 */
export const Divider = withContext("hr");

/**
 * Describes what a divider takes: the variants its recipe offers, and everything a styled rule
 * element takes.
 */
export type DividerProps = ComponentProps<typeof Divider>;
