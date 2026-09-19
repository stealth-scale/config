/**
 * Draws the way back, for a page reached from somewhere in particular.
 *
 * @remarks
 *   A single link up one level, which is what a folded page shows in place of a whole trail. Name
 *   where it goes rather than the direction: `Invoices` tells a reader what they will land on,
 *   where `Back` tells them only that they will leave.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the link at the size the column states.
 */
export const Trail = withContext("a", "trail");

/**
 * Describes what the way back takes.
 */
export type TrailProps = ComponentProps<typeof Trail>;
