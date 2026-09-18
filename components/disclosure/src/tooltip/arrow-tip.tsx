/**
 * Draws the turned square inside the arrow.
 *
 * @remarks
 *   The shape is a square rotated into a diamond, of which one corner shows past the edge of the
 *   box. It is filled from the same custom property the box states its surface as, so the point and
 *   the box are never two different colours.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Draws the shape the arrow shows.
 */
const Turned = withContext("div", "arrowTip");

/**
 * Describes what the tip takes.
 */
export type ArrowTipProps = ComponentProps<typeof Turned>;

/**
 * Shows one corner past the edge of the box.
 *
 * @param props - Everything a styled div takes.
 * @returns The tip, turned by the machine.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const api = useTooltip();

  return <Turned {...mergeProps(api.getArrowTipProps(), props)} />;
}
