/**
 * Draws the control a person presses to show and hide the block.
 *
 * @remarks
 *   The element is `button`, and the machine writes what tells a screen reader what it does:
 *   whether the block is expanded, and which element it controls. Neither is this component's to
 *   state, because the machine holds the id both sides are named by.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#collapsible/context.ts";
import { useCollapsible } from "#collapsible/machine.ts";

/**
 * Draws the control at the size the root states.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes what the trigger takes.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Shows the block where it is hidden, and hides it where it is shown.
 *
 * @param props - Everything a styled button takes.
 * @returns The control, carrying what the machine says it does.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useCollapsible();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
