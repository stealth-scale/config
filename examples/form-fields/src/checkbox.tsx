/**
 * Draws a checkbox bound to a boolean field, with its label beside it rather than above it.
 */

import { type ReactElement, useId } from "react";

import { textOf, useProperty, useWords } from "@stealthscale/provider-form";

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
 *   A checkbox draws its own label inside the control, so it takes no frame and writes the error
 *   itself, shown once a person has touched the field or a submit was attempted.
 */
export function CheckboxField({ label, required }: CheckboxFieldProps): ReactElement {
  const field = useBoundField<boolean>();
  const property = useProperty();
  const words = useWords();
  const id = useId();
  const [error] = field.state.meta.errors;
  const shown = field.state.meta.isTouched && error !== undefined;
  const { schema } = property;

  return (
    <div className="field">
      <label>
        <input
          aria-describedby={`${id}-error`}
          aria-invalid={shown}
          aria-required={required ?? property.required}
          checked={field.state.value}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.checked);
          }}
          type="checkbox"
        />{" "}
        {words.label(
          field.name,
          label ?? (schema === undefined ? undefined : textOf(schema, "title")),
        )}
      </label>
      {shown ? (
        <p id={`${id}-error`} role="alert">
          {words.error(field.name, error)}
        </p>
      ) : null}
    </div>
  );
}
