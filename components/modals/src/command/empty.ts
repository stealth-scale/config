/**
 * Draws the line standing where nothing matches.
 *
 * @remarks
 *   Say what was looked through. `No commands match` tells a reader the palette searched and found
 *   nothing, where `No results` leaves them unsure whether it searched at all.
 *   The list draws this only when it is empty, so the words are in the document exactly when they
 *   are true and a screen reader walking the panel never reads them over a list of rows.
 */

import { type ComponentProps } from "react";

import { withContext } from "#command/context.ts";

/**
 * Draws the line at the size the panel states.
 */
export const Empty = withContext("p", "empty");

/**
 * Describes what the empty line takes.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
