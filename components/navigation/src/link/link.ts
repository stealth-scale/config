/**
 * Draws a link through its recipe.
 *
 * @remarks
 *   The element is `a`, which a browser focuses, follows on Enter, and offers to open elsewhere. A
 *   link with no `href` is not a link to anything and a browser gives it none of that, so a control
 *   that acts rather than navigates is a button and not a link drawn as one.
 *   A router's own link component goes in through `as`, which keeps the routing and leaves the
 *   drawing here.
 */

import { type ComponentProps } from "react";

import { withContext } from "#link/context.ts";

/**
 * Draws words a person follows to somewhere else.
 */
export const Link = withContext("a");

/**
 * Describes what a link takes: the variants its recipe offers, and everything a styled anchor
 * takes.
 */
export type LinkProps = ComponentProps<typeof Link>;
