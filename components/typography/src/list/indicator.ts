/**
 * Draws the mark a caller puts beside an entry in place of the browser's.
 *
 * @remarks
 *   The element is `span`, and what it holds is the caller's, an icon or a figure. It sits beside
 *   the entry's text at the small gap, in the plain look that leaves the entry a row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#list/context.ts";

/**
 * Draws the mark beside an entry, holding whatever the caller hands it.
 */
export const Indicator = withContext("span", "indicator");

/**
 * Describes what an indicator takes: everything a styled span element takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
