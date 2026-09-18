/**
 * Draws words a screen reader reads and an eye never sees.
 *
 * @remarks
 *   The element is `span`, which carries no meaning of its own, because the words inside it are
 *   the meaning. A caller naming a region or a table cell changes the element with `as`. The words
 *   stay in the accessibility tree, which is the whole point: a mark with no label, a heading a
 *   page needs and a design does not, and the words that tell a reader what a control does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#visually-hidden/context.ts";

/**
 * Reads its words to a screen reader and draws them nowhere.
 */
export const VisuallyHidden = withContext("span");

/**
 * Describes what hidden text takes: the variants its recipe offers, and everything a styled span
 * element takes.
 */
export type VisuallyHiddenProps = ComponentProps<typeof VisuallyHidden>;
