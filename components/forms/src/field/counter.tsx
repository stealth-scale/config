/**
 * Draws how much of a field's allowance is used.
 *
 * @remarks
 *   The element is `p`, drawn against the end of the row the helper text sits in. It states
 *   `aria-live="polite"`, so a reader hears the count when they pause rather than after every
 *   keystroke.
 *   The count stays out of `aria-describedby`. A description is read when the control takes focus,
 *   and a number that changes as a person types would be read stale.
 *   The component draws the count a caller passes and measures nothing. What counts as a character
 *   differs by field: an emoji is two UTF-16 units and one grapheme, and a server that truncates
 *   at 140 may mean either.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";

/**
 * Draws the count at the size the root states.
 */
const Counted = withContext("p", "counter", { defaultProps: { "aria-live": "polite" } });

/**
 * Describes what the count takes: everything a styled p takes.
 */
export type CounterProps = ComponentProps<typeof Counted>;

/**
 * Reports how much of the allowance a person has used.
 *
 * @param props - Everything a styled p takes.
 * @returns The count, announced when the reader pauses.
 */
export function Counter(props: CounterProps): ReactElement {
  return <Counted {...props} />;
}
