/**
 * Draws the card's root: the panel every band sits in, which takes the look and the size.
 *
 * @remarks
 *   An article, because a card is a self-contained composition a reader takes in on its own. The
 *   root adds no color, no size and no margin. All of that is the recipe's, so a theme moves
 *   every card by extending it.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#card/card.context.ts";

/**
 * Draws the panel, in a look and a size, and hands both to the bands below.
 */
export const Root = withProvider("article", "root");

/**
 * Describes what a card takes: the variants its recipe offers, and everything an article takes.
 */
export type RootProps = ComponentProps<typeof Root>;
