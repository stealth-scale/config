/**
 * Draws the cell around one field of a generated form.
 */

import { type ReactNode } from "react";

import { type CellProps } from "@stealthscale/provider-form";

/**
 * Draws a field as it is, or inside an element spanning the columns it takes.
 */
export function Cell({ children, span }: CellProps): ReactNode {
  return span === undefined ? children : <div className={`span-${span}`}>{children}</div>;
}
