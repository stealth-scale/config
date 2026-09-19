/**
 * Draws what the section is about.
 *
 * @remarks
 *   The element is `div`. State `data-bleed` on a body holding a table or a list, and it drops the
 *   card's padding and runs to the card's edges with a hairline parting it from the header. The
 *   card clips what it holds, so a bleeding body keeps the card's corners.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the content at the room the block states.
 */
export const Body = withContext("div", "body");

/**
 * Describes what the body takes.
 */
export type BodyProps = ComponentProps<typeof Body>;
