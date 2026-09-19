/**
 * Draws the group the table's columns are declared in.
 *
 * @remarks
 *   The element is `colgroup`, written as the table's first child and before its rows. It declares
 *   nothing a reader sees and carries no semantics. What it gives is a place to state a column's
 *   width once, rather than on the first cell of every row and hoping the rest agree.
 *   A table with `layout="fixed"` takes its column widths from here. Without a declaration the
 *   columns share the table's width evenly, which is rarely what a table of one long column and
 *   three short ones wants.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Declares the table's columns.
 */
export const ColumnGroup = withContext("colgroup", "columnGroup");

/**
 * Describes what the group takes: everything a styled colgroup takes.
 */
export type ColumnGroupProps = ComponentProps<typeof ColumnGroup>;
