/**
 * Draws the mark at the start of the field.
 *
 * @remarks
 *   The element is `div` and holds whatever a caller draws in it: a glyph, a currency symbol, a
 *   unit. The mark takes no pointer, so a press over it reaches the field behind it, and whatever
 *   it holds takes the pointer back. A control drawn here is reachable by pointer and by keyboard
 *   alike.
 *   A mark that carries meaning is labelled by the caller. A decorative one states `aria-hidden`,
 *   which is what keeps a screen reader from reading a glyph before every field.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Places a mark against the start of the field.
 */
export const Start = withContext("div", "start");

/**
 * Describes what the mark takes: everything a styled div takes.
 */
export type StartProps = ComponentProps<typeof Start>;
