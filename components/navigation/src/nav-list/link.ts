/**
 * Draws the destination a reader presses.
 *
 * @remarks
 *   The element is `a`, and it takes an `href` like any other. State `aria-current="page"` on the
 *   row naming the page being read: that attribute is what a screen reader announces and what the
 *   `highlight` axis draws, so the two cannot disagree.
 *   A row drawn as a square keeps its words in the document and out of sight, because a row with
 *   no accessible name is no row at all to a screen reader.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Draws a destination at the size the list states.
 */
export const Link = withContext("a", "link");

/**
 * Describes what a destination takes.
 */
export type LinkProps = ComponentProps<typeof Link>;
