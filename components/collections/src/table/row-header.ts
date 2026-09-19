/**
 * Draws the name of a row.
 *
 * @remarks
 *   The element is `th` and it states `scope="row"`. A screen reader reading across a row names
 *   each cell by its column and by this, so a reader who has moved six columns in still knows
 *   which row they are on. A table whose first cell is the thing every other cell is about writes
 *   it here rather than as an ordinary cell.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Heads a row, so the cells across it answer to this name.
 */
export const RowHeader = withContext("th", "rowHeader", { defaultProps: { scope: "row" } });

/**
 * Describes what the name takes: everything a styled th takes.
 */
export type RowHeaderProps = ComponentProps<typeof RowHeader>;
