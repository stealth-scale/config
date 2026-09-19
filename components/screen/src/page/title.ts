/**
 * Draws the words naming the page.
 *
 * @remarks
 *   The element is `h1`. A page has one, and a reader jumping by heading lands here first, so a
 *   screen that draws two pages at once states `as="h2"` on the second.
 *   Its column is the one that gives. A long title wraps beside the actions rather than pushing
 *   them onto a line of their own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the words at the size the column states.
 */
export const Title = withContext("h1", "title");

/**
 * Describes what the title takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
