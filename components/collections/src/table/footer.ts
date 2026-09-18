/**
 * Draws the band the table's totals sit in.
 *
 * @remarks
 *   The element is `tfoot`, which a screen reader reads as the summary of the table rather than as
 *   another row of figures. A total written as an ordinary row says nothing about being one.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Closes the table with whatever its rows add up to.
 */
export const Footer = withContext("tfoot", "footer");

/**
 * Describes what the band takes: everything a styled tfoot takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;
