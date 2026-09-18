/**
 * Draws the mark at the end of the field.
 *
 * @remarks
 *   The element is `div` and holds whatever a caller draws in it: a glyph, a unit, a control that
 *   empties the field. The mark takes no pointer, so a press over it reaches the field behind it,
 *   and whatever it holds takes the pointer back.
 *   A mark that carries meaning is labelled by the caller. A decorative one states `aria-hidden`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Places a mark against the end of the field.
 */
export const End = withContext("div", "end");

/**
 * Describes what the mark takes: everything a styled div takes.
 */
export type EndProps = ComponentProps<typeof End>;
