/**
 * Draws one row of the table.
 *
 * @remarks
 *   The element is `tr`. A row a caller has picked states `aria-selected`, which the recipe's
 *   selected styling reads and a screen reader reads too. That is one attribute rather than two
 *   things able to disagree.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Draws one line of cells.
 */
export const Row = withContext("tr", "row");

/**
 * Describes what the row takes: everything a styled tr takes.
 */
export type RowProps = ComponentProps<typeof Row>;
