/**
 * Draws the band in the middle of the row.
 *
 * @remarks
 *   It takes the room the other two bands leave and centres what it holds, which is what a title
 *   or a set of segmented controls wants. A long title is cut short rather than wrapped, because a
 *   toolbar that grows to a second line moves everything under it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Draws the band at the gap the row states.
 */
export const Center = withContext("div", "center");

/**
 * Describes what the centre band takes.
 */
export type CenterProps = ComponentProps<typeof Center>;
