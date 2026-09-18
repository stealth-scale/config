/**
 * Draws the point that ties the panel to its control.
 *
 * @remarks
 *   The machine positions it against whichever edge it placed the panel on. It is hidden from a
 *   screen reader, the panel saying everything there is to say.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("div", "arrow");

/**
 * Describes what the part takes.
 */
export type ArrowProps = ComponentProps<typeof Drawn>;

/**
 * Draws the point that ties the panel to its control.
 *
 * @param props - Everything a styled div takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getArrowProps(), props)} />;
}
