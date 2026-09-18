/**
 * Draws the control a person fills in.
 *
 * @remarks
 *   Binds the text field, so a field holding one needs no `as`. Another control goes in its place
 *   with `as`, and the factory draws it under both recipes.
 *   The control takes its identifier, its state and the text describing it from the field, so a
 *   caller states each of them once on the root. `aria-invalid` is the attribute the field's own
 *   styling reads and the one a screen reader reads, which is one attribute rather than two things
 *   able to disagree.
 *   It is described by both texts whether or not either is drawn. An identifier naming no element
 *   is passed over, so listing both saves the field from watching the document to find out which
 *   exists.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { describedBy } from "#field/ids.ts";
import { useField } from "#field/state.ts";
import { Input } from "#input/input.ts";

/**
 * Draws the control in the slot the field states.
 */
const Filled = withContext(Input, "control");

/**
 * Describes what the control takes: the text field's variants, and everything a styled input
 * takes.
 */
export type ControlProps = ComponentProps<typeof Filled>;

/**
 * Draws what a person fills in, wired to the field around it.
 *
 * @param props - The control's own props, which win over the field's where they meet.
 * @returns The control, named and described by the field's parts.
 */
export function Control(props: ControlProps): ReactElement {
  const { disabled, ids, invalid, readOnly, required } = useField();

  return (
    <Filled
      aria-describedby={describedBy(ids)}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      id={ids.control}
      readOnly={readOnly}
      required={required}
      {...props}
    />
  );
}
