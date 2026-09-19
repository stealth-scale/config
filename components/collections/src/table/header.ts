/**
 * Draws the band of column names.
 *
 * @remarks
 *   The element is `thead`. Set `stickyHeader` on the scroller and the band's row stays put while
 *   the body scrolls under it, drawn on the panel surface so the rows do not read through it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Opens the table with its row of column names.
 */
export const Header = withContext("thead", "header");

/**
 * Describes what the band takes: everything a styled thead takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
