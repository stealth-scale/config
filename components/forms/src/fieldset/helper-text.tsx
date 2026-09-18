/**
 * Draws the text that sits beside the group whatever its state.
 *
 * @remarks
 *   The element is `p`. It explains the group rather than any one field in it, so it goes here and
 *   not in a field's own helper text.
 *   The root is described by this text, so a screen reader that reads a group's description reads
 *   it as focus enters the group. Support for describing a group varies, so the text is also drawn
 *   directly under the legend, where a reader meets it in document order before the first control.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Draws the text at the size the root states.
 */
const Worded = withContext("p", "helperText");

/**
 * Describes what the text takes: everything a styled p takes.
 */
export type HelperTextProps = ComponentProps<typeof Worded>;

/**
 * Says what a person needs to know about the group.
 *
 * @param props - Everything a styled p takes.
 * @returns The text, carrying the identifier the group keys it by.
 */
export function HelperText(props: HelperTextProps): ReactElement {
  const { ids } = useFieldset();

  return <Worded id={ids.helperText} {...props} />;
}
