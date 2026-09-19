/**
 * Draws the knob that crosses the track.
 *
 * @remarks
 *   The machine hides the thumb from the accessibility tree. Its position says what the input
 *   already reports, so a reader is told the switch is on once rather than twice.
 *   The thumb states no size. It fills the track's content box as a square, so the track's padding
 *   is the inset and one scale moves both.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#switch/context.ts";
import { useSwitch } from "#switch/machine.ts";

/**
 * Draws the knob inside the track the root states.
 */
const Knobbed = withContext("span", "thumb");

/**
 * Describes what the thumb takes.
 */
export type ThumbProps = ComponentProps<typeof Knobbed>;

/**
 * Crosses the track while the switch is on, and rests at its start while it is off.
 *
 * @param props - Everything a styled span takes.
 * @returns The knob, placed for the state the machine is in.
 */
export function Thumb(props: ThumbProps): ReactElement {
  const api = useSwitch();

  return <Knobbed {...mergeProps(api.getThumbProps(), props)} />;
}
