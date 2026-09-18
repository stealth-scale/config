/**
 * Draws the square that gives the point its shape.
 *
 * @remarks
 *   It is turned a quarter revolution and carries an edge on two of its sides, so the two that show
 *   past the panel continue the panel's own edge and the two behind it are covered by the panel.
 *   The fill is the panel's, read from the custom property the look sets, so a point under any of
 *   the three looks is drawn in the same fill as the panel it leaves.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the square at the look the root states.
 */
const Tipped = withContext("div", "arrowTip");

/**
 * Describes what the square takes.
 */
export type ArrowTipProps = ComponentProps<typeof Tipped>;

/**
 * Gives the point its shape.
 *
 * @param props - Everything a styled div takes.
 * @returns The square, carrying the place the machine measured.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const { api } = useMenu();

  return <Tipped {...mergeProps(api.getArrowTipProps(), props)} />;
}
