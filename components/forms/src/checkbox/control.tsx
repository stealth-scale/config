/**
 * Draws the box a person sees the state in.
 *
 * @remarks
 *   The machine hides the box from the accessibility tree. The input inside the root is the
 *   checkbox a reader is told about, so a box that announced itself would be read as a second one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Draws the box at the size the root states.
 */
const Boxed = withContext("div", "control");

/**
 * Describes what the control takes.
 */
export type ControlProps = ComponentProps<typeof Boxed>;

/**
 * Fills once the checkbox is on, and holds the mark a caller draws in it.
 *
 * @param props - Everything a styled div takes.
 * @returns The box, carrying the state the machine is in.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useCheckbox();

  return <Boxed {...mergeProps(api.getControlProps(), props)} />;
}
