/**
 * Draws the mark that turns as the block opens.
 *
 * @remarks
 *   A caller hands over a glyph without sizing it or turning it. It states `aria-hidden`, because
 *   it sits inside the trigger and everything inside a control is read as part of that control's
 *   name. A chevron drawn here would otherwise be announced after the words the trigger was named
 *   with, and the trigger already carries `aria-expanded`. The machine writes no such attribute, so
 *   this does. A caller whose mark says something the name does not can state
 *   `aria-hidden={false}`.
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

  return <Turned {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
