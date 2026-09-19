/**
 * Draws one cell of the table.
 *
 * @remarks
 *   The element is `td`. A cell of figures states `data-numeric`, which right-aligns it and sets
 *   it in tabular figures, so a column of numbers lines up at the decimal point and an eye reads
 *   down it. The attribute is a prop rather than an axis, because a slot recipe resolves its
 *   variants once at the root and a per-column switch cannot be one.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Draws one figure of a row.
 */
export const Cell = withContext("td", "cell");

/**
 * Describes what the cell takes: everything a styled td takes.
 */
export type CellProps = ComponentProps<typeof Cell>;
