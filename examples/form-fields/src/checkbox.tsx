/**
 * Draws a checkbox bound to a boolean field, with its label beside it rather than above it.
 */

import { type ReactElement, useId } from "react";

import { useBoundField } from "#field-like.ts";
import { useWords } from "#words.ts";

/**
 * Describes what a checkbox field is given.
 */
export interface CheckboxFieldProps {
  /**
   * The words of the label, where the catalogue has none and the path written out is wrong.
   */
  readonly label?: string | undefined;
}

/**
 * Draws a checkbox bound to the boolean field in scope.
 *
 * @remarks
 *   A checkbox draws its own label inside the control, so it takes no frame and writes the error
 *   itself, shown once a person has touched the field or a submit was attempted.
 */
export function CheckboxField({ label }: CheckboxFieldProps): ReactElement {
  const field = useBoundField<boolean>();
  const words = useWords();
  const id = useId();
  const [error] = field.state.meta.errors;
  const shown = field.state.meta.isTouched && error !== undefined;

  return (
    <div className="field">
      <label>
        <input
          aria-describedby={`${id}-error`}
          aria-invalid={shown}
          checked={field.state.value}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.checked);
          }}
          type="checkbox"
        />{" "}
        {words.label(field.name, label)}
      </label>
      {shown ? (
        <p id={`${id}-error`} role="alert">
          {words.error(field.name, error)}
        </p>
      ) : null}
    </div>
  );
}
