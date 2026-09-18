/**
 * Draws the mark that turns as the block opens.
 *
 * @remarks
 *   The mark says nothing a screen reader needs, because the trigger it sits in already says
 *   whether the block is expanded. The machine hides it from the accessibility tree for that
 *   reason, and a caller hands over a glyph without sizing it or turning it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#collapsible/context.ts";
import { useCollapsible } from "#collapsible/machine.ts";

/**
 * Draws the mark at the box the root states.
 */
const Turned = withContext("span", "indicator");

/**
 * Describes what the indicator takes.
 */
export type IndicatorProps = ComponentProps<typeof Turned>;

/**
 * Turns half a revolution while the block is open.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, turned to whichever way the machine is.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useCollapsible();

  return <Turned {...mergeProps(api.getIndicatorProps(), props)} />;
}
