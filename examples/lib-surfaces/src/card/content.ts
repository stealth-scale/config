/**
 * Draws the card's content: the band that holds whatever the card is about.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/card.context.ts";

/**
 * Draws the content band.
 */
export const Content = withContext("div", "content");

/**
 * Describes what a content band takes: everything a div takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
