/**
 * Draws the bar that slides under the control in force.
 *
 * @remarks
 *   The machine measures the selected control and writes its place as custom properties, so the
 *   recipe states the bar's thickness and its colour and never its position. It is hidden until
 *   there is something to measure, which is what keeps it from appearing at the start of the strip
 *   on the first render. It states `aria-hidden` once it has something to measure. The bar sits
 *   among the controls in the strip, and a `tablist` owns tabs, so an element carrying no role and
 *   no words is one more thing for a reader to step past. Which control is in force is
 *   `aria-selected` on the control itself.
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

  return <Bar {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
