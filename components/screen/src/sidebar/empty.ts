/**
 * Draws the line standing where the search finds nothing.
 *
 * @remarks
 *   Say what was looked through. `No projects match` tells a reader the sidebar searched and found
 *   nothing, where `No results` leaves them unsure whether it searched at all.
 *   Draw it only where nothing matches, so the words are in the document exactly when they are
 *   true.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the line at the room the column states.
 */
export const Empty = withContext("p", "empty");

/**
 * Describes what the empty line takes.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
