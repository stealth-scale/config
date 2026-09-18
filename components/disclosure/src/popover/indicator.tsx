/**
 * Draws the mark that turns as the panel opens.
 *
 * @remarks
 *   It says nothing to a screen reader, the control it sits in already saying whether the panel is
 *   open.
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

  return <Drawn {...mergeProps(api.getIndicatorProps(), props)} />;
}
