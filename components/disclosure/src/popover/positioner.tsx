/**
 * Draws the box that holds the panel in place beside its control.
 *
 * @remarks
 *   The machine measures the control and writes this element's position as inline styles. A caller
 *   who needs the panel out of a clipping or stacking ancestor wraps this part in a portal rather
 *   than the popover doing it for them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("div", "positioner");

/**
 * Describes what the part takes.
 */
export type PositionerProps = ComponentProps<typeof Drawn>;

/**
 * Draws the box that holds the panel in place beside its control.
 *
 * @param props - Everything a styled div takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Positioner(props: PositionerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getPositionerProps(), props)} />;
}
