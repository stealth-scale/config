/**
 * Draws the name of a column.
 *
 * @remarks
 *   The element is `th` and it states `scope="col"`, which is what tells a screen reader that the
 *   cells under it answer to this name. A `th` without a scope is guessed at, and a guess on a
 *   table with both a column header and a row header is wrong about one of them.
 *   A column of figures states `data-numeric`, which right-aligns the name over the numbers it
 *   heads.
 *   A column a reader can sort by states `aria-sort` as `ascending`, `descending` or `none`. The
 *   sorting itself is the page's.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Heads a column, so the cells under it answer to this name.
 */
export const ColumnHeader = withContext("th", "columnHeader", {
  defaultProps: { scope: "col" },
});

/**
 * Describes what the name takes: everything a styled th takes.
 */
export type ColumnHeaderProps = ComponentProps<typeof ColumnHeader>;
