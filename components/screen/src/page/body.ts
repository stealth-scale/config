/**
 * Draws what the page is about.
 *
 * @remarks
 *   It takes the room the bands above and below it leave and lays what it holds out down a column,
 *   so a table or a list can fill the page rather than ending where its rows do.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the content at the room the column states.
 */
export const Body = withContext("div", "body");

/**
 * Describes what the body takes.
 */
export type BodyProps = ComponentProps<typeof Body>;
