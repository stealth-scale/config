/**
 * Draws the table itself.
 *
 * @remarks
 *   The element is `table`, which a screen reader announces with its size and lets a reader move
 *   through cell by cell. Every semantic a table has is the element's, so the recipe adds none.
 *   The `layout` axis decides whether the columns take their width from their content or share the
 *   table's evenly. A table of figures reads better fixed, because a column that changes width as
 *   the numbers change is one an eye cannot track down.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Draws the table, inside the box that scrolls it.
 */
export const Root = withContext("table", "root");

/**
 * Describes what the table takes: everything a styled table takes.
 */
export type RootProps = ComponentProps<typeof Root>;
