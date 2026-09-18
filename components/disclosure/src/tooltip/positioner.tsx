/**
 * Draws the box that holds the tooltip in place beside its control.
 *
 * @remarks
 *   The machine measures the control and writes this element's position as inline styles, so the
 *   recipe states nothing about where it goes. A caller who needs the box out of a clipping or
 *   stacking ancestor wraps this part in a portal rather than the tooltip doing it for them, which
 *   keeps the choice of portal with the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Draws the box the machine positions.
 */
const Placed = withContext("div", "positioner");

/**
 * Describes what the positioner takes.
 */
export type PositionerProps = ComponentProps<typeof Placed>;

/**
 * Draws the box wherever the machine measured room for it.
 *
 * @param props - Everything a styled div takes.
 * @returns The box, positioned by the machine.
 */
export function Positioner(props: PositionerProps): ReactElement {
  const api = useTooltip();

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
