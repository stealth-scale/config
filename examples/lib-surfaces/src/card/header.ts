/**
 * Draws the card's header: the band that names the card, set in the heading of the card's size.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/card.context.ts";

/**
 * Draws the header band.
 */
export const Header = withContext("header", "header");

/**
 * Describes what a header takes: everything a header element takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
