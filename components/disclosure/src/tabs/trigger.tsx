/**
 * Draws one control of the strip.
 *
 * @remarks
 *   A control names the panel it shows with `value`, which is the one thing the machine cannot work
 *   out for itself. Everything else is the machine's: the tab role, whether it is selected, which
 *   panel it controls, and the tab stop, which moves with the selection so a keyboard reaches the
 *   strip once and then moves inside it with the arrows.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Draws the control at the size the root states.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes what a control takes.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Whether a person can reach it at all.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Says which panel this control shows.
   */
  readonly value: string;
}

/**
 * Shows the panel it names.
 *
 * @param props - The panel it names, and everything a styled button takes.
 * @returns The control, carrying its role and its selection.
 */
export function Trigger({ disabled, value, ...rest }: TriggerProps): ReactElement {
  const api = useTabs();
  const stated = { ...(disabled === undefined ? {} : { disabled }), value };

  return <Pressed {...mergeProps(api.getTriggerProps(stated), rest)} />;
}
