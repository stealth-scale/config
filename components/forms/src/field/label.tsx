/**
 * Draws the words naming the control.
 *
 * @remarks
 *   The element is `label` and it points at the control with `htmlFor`, which is what makes the
 *   words a name a screen reader reads and what makes a press on them move focus into the control.
 *   A control named by `aria-label` instead has a name and no target for a press.
 *   The label carries the field's disabled state, so words beside a control a person cannot reach
 *   are drawn as unreachable too.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Draws the words at the size the root states.
 */
const Worded = withContext("label", "label");

/**
 * Describes what the label takes: everything a styled label takes.
 */
export type LabelProps = ComponentProps<typeof Worded>;

/**
 * Labels the control, and moves focus into it when pressed.
 *
 * @param props - Everything a styled label takes.
 * @returns The words, pointing at the control.
 */
export function Label(props: LabelProps): ReactElement {
  const { disabled, ids } = useField();

  return (
    <Worded data-disabled={disabled || undefined} htmlFor={ids.control} id={ids.label} {...props} />
  );
}
