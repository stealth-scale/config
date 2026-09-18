/**
 * Draws the control the box appears beside.
 *
 * @remarks
 *   The element is `button`, and a caller drawing something else passes it through `as`. The
 *   machine writes the pointer and focus handlers that open the box, and the reference that ties
 *   the control to it, so a screen reader reads the words as a description of the control.
 *   A tooltip attached to a control that is not focusable is a tooltip a keyboard never sees, which
 *   is why the default element is one a browser focuses.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Draws the control, styled by whatever the caller drew rather than by this recipe.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes what the control takes.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Opens the box as a pointer rests on it or focus reaches it.
 *
 * @param props - Everything a styled button takes.
 * @returns The control, carrying what the machine needs to open the box.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useTooltip();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
