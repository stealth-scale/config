/**
 * Draws the turned square inside the point.
 *
 * @remarks
 *   It is filled from the same custom property the panel states its surface as, so the point and
 *   the panel are never two different colours.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("div", "arrowTip");

/**
 * Describes what the part takes.
 */
export type ArrowTipProps = ComponentProps<typeof Drawn>;

/**
 * Draws the turned square inside the point.
 *
 * @param props - Everything a styled div takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getArrowTipProps(), props)} />;
}
