/**
 * Draws what a card is called.
 *
 * @remarks
 *   The element is `h3`, which puts a card under a section's own heading in the outline a screen
 *   reader reads. A page whose cards sit at another depth states the level with `as`, because the
 *   level belongs to the page's structure and not to the card.
 *   The size axis sets the text style, so the title steps with the room the card leaves round it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Heads the card, at the level the page's outline needs.
 */
export const Title = withContext("h3", "title");

/**
 * Describes what the title takes: everything a styled h3 takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
