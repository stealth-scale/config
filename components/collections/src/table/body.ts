/**
 * Draws the band the table's rows sit in.
 *
 * @remarks
 *   The element is `tbody`. The stripe and the hover are written here and reach the band's own
 *   rows, because `:nth-of-type` counts within a parent: a rule on the row itself would stripe the
 *   header's single row as well.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Groups the rows of figures.
 */
export const Body = withContext("tbody", "body");

/**
 * Describes what the band takes: everything a styled tbody takes.
 */
export type BodyProps = ComponentProps<typeof Body>;
