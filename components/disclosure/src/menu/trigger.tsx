/**
 * Draws the control that opens the menu.
 *
 * @remarks
 *   The machine gives it the button role, says whether the menu is open, and points it at the panel
 *   it opens. A caller naming a value turns it into one of several controls that share one menu,
 *   which the machine tracks so the panel is placed against whichever was pressed.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the control at the size the root states.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes what the control takes.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * The value that identifies this control, for a menu opened from more than one.
   */
  readonly value?: string | undefined;
}

/**
 * Opens the menu.
 *
 * @param props - The name of this control, and everything a styled button takes.
 * @returns The control, carrying what the machine writes onto it.
 */
export function Trigger({ value, ...rest }: TriggerProps): ReactElement {
  const { api } = useMenu();
  const named = value === undefined ? {} : { value };

  return <Pressed {...mergeProps(api.getTriggerProps(named), rest)} />;
}
