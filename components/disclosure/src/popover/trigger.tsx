/**
 * Draws the control that opens the panel.
 *
 * @remarks
 *   The machine writes whether the panel is open, which panel it controls, and the handlers that
 *   open and shut it. The element is `button`, because a control a browser does not focus is a
 *   control a keyboard never reaches.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes what the part takes.
 */
export type TriggerProps = ComponentProps<typeof Drawn>;

/**
 * Draws the control that opens the panel.
 *
 * @param props - Everything a styled button takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getTriggerProps(), props)} />;
}
