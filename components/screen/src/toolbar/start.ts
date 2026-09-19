/**
 * Draws the band at the start of the row.
 *
 * @remarks
 *   What acts on the whole of what the toolbar sits above: a back control, a filter, a set of
 *   views. It takes only the room it needs, so the centre gets the rest.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Draws the band at the gap the row states.
 */
export const Start = withContext("div", "start");

/**
 * Describes what the start band takes.
 */
export type StartProps = ComponentProps<typeof Start>;
