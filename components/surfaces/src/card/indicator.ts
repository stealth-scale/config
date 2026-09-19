/**
 * Draws the mark that opens a card's header.
 *
 * @remarks
 *   The element is `div` and holds a glyph, an avatar or a status dot. It takes the first column
 *   of the header's grid and spans both of its lines, so a mark sits against the title and the
 *   description together rather than against one of them.
 *   A mark that carries meaning is labelled by the caller. A decorative one states `aria-hidden`,
 *   which keeps a screen reader from reading a glyph before every card.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Marks the card, beside what it is called.
 */
export const Indicator = withContext("div", "indicator");

/**
 * Describes what the mark takes: everything a styled div takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
