/**
 * Draws the card's footer: the band that holds the card's actions, set to the end of the row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/card.context.ts";

/**
 * Draws the footer band.
 */
export const Footer = withContext("footer", "footer");

/**
 * Describes what a footer takes: everything a footer element takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;
