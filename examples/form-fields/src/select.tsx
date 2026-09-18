/**
 * Draws a select bound to a string field whose schema lists its choices.
 */

import { type ReactElement } from "react";

import { choicesOf, useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#field-like.ts";
import { type FieldProps, Frame } from "#frame.tsx";

/**
 * Describes what a select field is given.
 */
export interface SelectFieldProps extends FieldProps {
  /**
   * The choices. The schema's `enum` where the caller states none. Each reads its words from the
   * catalogue under `<id>.fields.<path>.options.<value>`, and its value where the catalogue has
   * none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Draws a select in a frame, bound to the string field in scope, with an empty first choice so
 * a person picks one on purpose. The empty choice reads the field's placeholder from the
 * catalogue, or "Choose" where it has none.
 */
export function SelectField({ label, options, required }: SelectFieldProps): ReactElement {
  const field = useBoundField<string>();
  const { schema } = useProperty();
  const words = useWords();
  const placeholder = words.placeholder(field.name);
  const choices = options ?? (schema === undefined ? [] : choicesOf(schema));

  return (
    <Frame label={label} required={required}>
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
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {words.option(field.name, choice)}
            </option>
          ))}
        </select>
      )}
    </Frame>
  );
}
