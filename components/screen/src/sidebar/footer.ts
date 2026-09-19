/**
 * Draws the band at the foot of the sidebar.
 *
 * @remarks
 *   What a person reaches for last and expects to find in the same place: an account, a help link,
 *   the control that collapses the sidebar. It stays put while the destinations above it scroll.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the band at the room the column states.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes what the footer takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;
