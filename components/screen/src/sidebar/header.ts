/**
 * Draws the band at the head of the sidebar.
 *
 * @remarks
 *   What names the thing being worked in: a switcher, a logo, a home link. It stays put while the
 *   destinations under it scroll.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the band at the room the column states.
 */
export const Header = withContext("div", "header");

/**
 * Describes what the header takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
