/**
 * Draws the point that ties the box to its control.
 *
 * @remarks
 *   Two elements rather than one. The machine positions the outer against whichever edge it placed
 *   the box on, and the tip inside it is the turned square that draws the shape. Both are hidden
 *   from a screen reader, the words in the box saying everything there is to say.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Draws the outer element the machine places.
 */
const Placed = withContext("div", "arrow");

/**
 * Describes what the arrow takes.
 */
export type ArrowProps = ComponentProps<typeof Placed>;

/**
 * Points from the box back at the control.
 *
 * @param props - Everything a styled div takes.
 * @returns The arrow, placed by the machine.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const api = useTooltip();

  return <Placed {...mergeProps(api.getArrowProps(), props)} />;
}
