/**
 * Draws the band a card opens with.
 *
 * @remarks
 *   The element is `div` and carries no role. The title inside it states the heading, so a role
 *   here would announce a grouping that is not one.
 *   The band is a grid of three columns: the indicator, the title block, and the aside. The title
 *   and the description take the middle column on one line each, so a mark on either side spans
 *   both of them without a wrapper the anatomy does not name.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Stacks the title and whatever sits beside it.
 */
export const Header = withContext("div", "header");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
