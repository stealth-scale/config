/**
 * Declares one column of the table.
 *
 * @remarks
 *   The element is `col`, which draws no box of its own. A browser reads four things off it:
 *   the width, the background, the border and whether the column is drawn at all. Everything else
 *   stated here is ignored, so a column is tinted and sized from this and styled from its cells.
 *   A column a caller highlights sets its own background here, which reaches every cell of the
 *   column in one declaration rather than one per row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Declares one column, for its width and its tint.
 */
export const Column = withContext("col", "column");

/**
 * Describes what the column takes: everything a styled col takes.
 */
export type ColumnProps = ComponentProps<typeof Column>;
