/**
 * Draws the control that sorts a column.
 *
 * @remarks
 *   The element is `button`, inside the column header rather than in place of it. A `th` that is
 *   itself pressable has no role a reader can act on, and one carrying `tabindex` announces a
 *   control that says nothing. A button inside it is reachable, pressable and named by its own
 *   words, which is the arrangement the WAI-ARIA practices describe for a sortable column.
 *   The header states `aria-sort`, not this. The attribute says which way the column runs now, and
 *   it belongs on the cell a screen reader reads when it reaches the column.
 *   Sorting is the page's. This draws the affordance and reports the press.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Presses to sort the column its header names.
 */
export const Sorter = withContext("button", "sorter", { defaultProps: { type: "button" } });

/**
 * Describes what the control takes: everything a styled button takes.
 */
export type SorterProps = ComponentProps<typeof Sorter>;
