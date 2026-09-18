/**
 * Draws a number box bound to a number field.
 */

import { type ReactElement } from "react";

import { useBoundField } from "#field-like.ts";
import { type FieldProps, Frame } from "#frame.tsx";

/**
 * Describes what a number field is given.
 */
export type NumberFieldProps = FieldProps;

/**
 * Draws a number box in a frame, bound to the number field in scope.
 *
 * @remarks
 *   An emptied box writes zero, so the value stays a number and the schema's `minimum` is what
 *   refuses it.
 */
export function NumberField({ label, required }: NumberFieldProps): ReactElement {
  const field = useBoundField<number>();

  return (
    <Frame label={label} required={required}>
      {(control) => (
        <input
          {...control}
          onBlur={field.handleBlur}
          onChange={(event) => {
            const { valueAsNumber } = event.target;

            field.handleChange(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
          }}
          type="number"
          value={field.state.value}
        />
      )}
    </Frame>
  );
}
