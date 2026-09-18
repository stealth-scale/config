/**
 * Draws the control that shuts the panel.
 *
 * @remarks
 *   Escape shuts the panel too, so this is for a pointer. It is named by the machine, so a caller
 *   drawing a glyph in it needs no label of their own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("button", "closeTrigger");

/**
 * Describes what the part takes.
 */
export type CloseTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Draws the control that shuts the panel.
 *
 * @param props - Everything a styled button takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function CloseTrigger(props: CloseTriggerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getCloseTriggerProps(), props)} />;
}
