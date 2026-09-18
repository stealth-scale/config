/**
 * Draws a select bound to a string field whose schema lists its choices.
 */

import { type ReactElement } from "react";

import { useBoundField } from "#field-like.ts";
import { Frame } from "#frame.tsx";
import { useWords } from "#words.ts";

/**
 * Describes what a select field is given.
 */
export interface SelectFieldProps {
  /**
   * The words of the label, where the catalogue has none and the path written out is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The choices, which are the schema's `enum`. Each reads its words from the catalogue under
   * `<id>.fields.<path>.options.<value>`, and its value where the catalogue has none.
   */
  readonly options: readonly string[];
}

/**
 * Draws a select in a frame, bound to the string field in scope, with an empty first choice so
 * a person picks one on purpose. The empty choice reads the field's placeholder from the
 * catalogue, or "Choose" where it has none.
 */
export function SelectField({ label, options }: SelectFieldProps): ReactElement {
  const field = useBoundField<string>();
  const words = useWords();
  const placeholder = words.placeholder(field.name);

  return (
    <Frame label={label}>
      {(control) => (
        <select
          {...control}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          value={field.state.value}
        >
          <option value="">{placeholder === "" ? "Choose" : placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {words.option(field.name, option)}
            </option>
          ))}
        </select>
      )}
    </Frame>
  );
}
