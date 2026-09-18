/**
 * Draws the bar that slides under the control in force.
 *
 * @remarks
 *   The machine measures the selected control and writes its place as custom properties, so the
 *   recipe states the bar's thickness and its colour and never its position. It is hidden until
 *   there is something to measure, which is what keeps it from appearing at the start of the strip
 *   on the first render.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Draws the bar at the thickness the look states.
 */
const Bar = withContext("div", "indicator");

/**
 * Describes what the bar takes.
 */
export type IndicatorProps = ComponentProps<typeof Bar>;

/**
 * Moves to whichever control is in force.
 *
 * @param props - Everything a styled div takes.
 * @returns The bar, positioned by the machine.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useTabs();

  return <Bar {...mergeProps(api.getIndicatorProps(), props)} />;
}
