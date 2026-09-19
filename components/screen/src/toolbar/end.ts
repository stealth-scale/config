/**
 * Draws the band at the end of the row.
 *
 * @remarks
 *   It is pushed to the end whatever the centre holds, so the controls a reader reaches for last
 *   are always in the same place.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Draws the band at the gap the row states.
 */
export const End = withContext("div", "end");

/**
 * Describes what the end band takes.
 */
export type EndProps = ComponentProps<typeof End>;
