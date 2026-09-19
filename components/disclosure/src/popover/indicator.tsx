/**
 * Draws the mark that turns as the panel opens.
 *
 * @remarks
 *   It states `aria-hidden`, because it sits inside the control and everything inside a control is
 *   read as part of that control's name. A chevron drawn here would otherwise be announced after
 *   the words the control was named with, and the control already carries `aria-expanded`. A caller
 *   whose mark says something the name does not can state `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("span", "indicator");

/**
 * Describes what the part takes.
 */
export type IndicatorProps = ComponentProps<typeof Drawn>;

/**
 * Draws the mark that turns as the panel opens.
 *
 * @param props - Everything a styled span takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
