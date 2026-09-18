/**
 * Draws a checkbox bound to a boolean field, with its label beside it rather than above it.
 */

import { type ReactElement } from "react";

import { useFieldAria } from "@stealthscale/provider-form";

import { useBoundField } from "#field-like.ts";
import { type FieldProps } from "#frame.tsx";

/**
 * Describes what a checkbox field is given.
 */
export type CheckboxFieldProps = FieldProps;

/**
 * Draws a checkbox bound to the boolean field in scope.
 *
 * @remarks
 *   A checkbox draws its own label around the control, so it takes no frame and writes the help
 *   text and the error itself from what the foundation resolves. The error is shown once a person
 *   has touched the field or a submit was attempted.
 */
export function CheckboxField({ label, required }: CheckboxFieldProps): ReactElement {
  const field = useBoundField<boolean>();
  const aria = useFieldAria({ label, required });

  return (
    <div className="field">
      <label {...aria.label.props}>
        <input
          {...aria.control}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.checked);
          }}
          type="checkbox"
        />{" "}
        {aria.label.text}
      </label>
      {aria.description === undefined ? null : (
        <p {...aria.description.props}>{aria.description.text}</p>
      )}
      {aria.error === undefined ? null : <p {...aria.error.props}>{aria.error.text}</p>}
    </div>
  );
}
