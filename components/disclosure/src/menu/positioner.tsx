/**
 * Draws the box the machine places the panel in.
 *
 * @remarks
 *   The machine measures the control and the room around it and writes the position as inline
 *   styles, beside the height and the width left on the screen. The panel reads the height for its
 *   own cap, so a menu opened near the edge of a window scrolls inside itself. Nothing here states
 *   a position, and a caller wanting the panel out of an overflowing ancestor draws this as their
 *   own portal.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the box at the size the root states.
 */
const Placed = withContext("div", "positioner");

/**
 * Describes what the box takes.
 */
export type PositionerProps = ComponentProps<typeof Placed>;

/**
 * Places the panel against the control.
 *
 * @param props - Everything a styled div takes.
 * @returns The box, carrying the position the machine measured.
 */
export function Positioner(props: PositionerProps): ReactElement {
  const { api } = useMenu();

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
