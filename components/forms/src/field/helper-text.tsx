/**
 * Draws the text that sits beside the field whatever its state.
 *
 * @remarks
 *   The element is `p`. It carries the identifier the control is described by, so a screen reader
 *   reads it after the field's name and before a person types.
 *   Reach for it for what a person needs to know in advance: the format a date takes, how long a
 *   password has to be. What went wrong goes in the error text, which replaces nothing and is read
 *   after this.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Draws the text at the size the root states.
 */
const Worded = withContext("p", "helperText");

/**
 * Describes what the text takes: everything a styled p takes.
 */
export type HelperTextProps = ComponentProps<typeof Worded>;

/**
 * Says what a person needs to know before they fill the field in.
 *
 * @param props - Everything a styled p takes.
 * @returns The text, carrying the identifier the control names it by.
 */
export function HelperText(props: HelperTextProps): ReactElement {
  const { ids } = useField();

  return <Worded id={ids.helperText} {...props} />;
}
