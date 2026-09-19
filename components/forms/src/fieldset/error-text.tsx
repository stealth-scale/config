/**
 * Draws what went wrong with the group.
 *
 * @remarks
 *   The element is `p`. It renders nothing where the group is not wrong, and states `role="alert"`
 *   where it is, so a message raised after a person submits reaches a reader who is not looking at
 *   the group.
 *   Reach for it where the fault is the group's rather than one field's: a set of options none of
 *   which was chosen, or two dates in the wrong order. A fault belonging to one field goes in that
 *   field's own message, where a screen reader reads it as the control takes focus.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Draws the message at the size the root states.
 */
const Worded = withContext("p", "errorText");

/**
 * Describes what the message takes: everything a styled p takes.
 */
export type ErrorTextProps = ComponentProps<typeof Worded>;

/**
 * Says what went wrong with the group, where the group is wrong.
 *
 * @param props - Everything a styled p takes.
 * @returns The message, or nothing where the group is not wrong.
 */
export function ErrorText(props: ErrorTextProps): ReactElement | undefined {
  const { ids, invalid } = useFieldset();

  if (!invalid) return undefined;

  return <Worded id={ids.errorText} role="alert" {...props} />;
}
