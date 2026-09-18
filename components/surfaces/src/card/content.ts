/**
 * Draws the band a card's substance sits in.
 *
 * @remarks
 *   The element is `div` and carries no role. The band stacks whatever it holds at the body text
 *   style, so a card of running text needs no `Text` around every line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Stacks whatever the card is about.
 */
export const Content = withContext("div", "content");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
