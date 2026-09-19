/**
 * Draws the track the thumb slides along.
 *
 * @remarks
 *   The machine hides the track from the accessibility tree. The input inside the root is the
 *   control a reader is told about, so a track that announced itself would be read as a second one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#switch/context.ts";
import { useSwitch } from "#switch/machine.ts";

/**
 * Draws the track at the size the root states.
 */
const Tracked = withContext("span", "control");

/**
 * Describes what the control takes.
 */
export type ControlProps = ComponentProps<typeof Tracked>;

/**
 * Fills once the switch is on, and holds the thumb that crosses it.
 *
 * @param props - Everything a styled span takes.
 * @returns The track, carrying the state the machine is in.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useSwitch();

  return <Tracked {...mergeProps(api.getControlProps(), props)} />;
}
