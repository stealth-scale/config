/**
 * Draws a number box bound to a number field.
 */

import { type ReactElement } from "react";

import { useBoundField } from "#field-like.ts";
import { Frame } from "#frame.tsx";

/**
 * Describes what a number field is given.
 */
export interface NumberFieldProps {
  /**
   * The words of the label, where the catalogue has none and the path written out is wrong.
   */
  readonly label?: string | undefined;
}

/**
 * Draws a number box in a frame, bound to the number field in scope.
 *
 * @remarks
 *   An emptied box writes zero, so the value stays a number and the schema's `minimum` is what
 *   refuses it.
 */
export function NumberField({ label }: NumberFieldProps): ReactElement {
  const field = useBoundField<number>();

  return (
    <Frame label={label}>
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
