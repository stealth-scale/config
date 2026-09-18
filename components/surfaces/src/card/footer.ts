/**
 * Draws the band a card's controls sit in.
 *
 * @remarks
 *   The element is `div` and carries no role. The band lays its controls in a row that wraps, so a
 *   narrow card stacks them rather than overflowing. The `justify` axis decides where they sit: a
 *   card with one destructive action and one safe one puts them at opposite ends as often as it
 *   groups them at the end.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Lays out whatever a reader acts on.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;
