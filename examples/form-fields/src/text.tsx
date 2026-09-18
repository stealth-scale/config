/**
 * Draws a text box bound to a string field.
 */

import { type ReactElement } from "react";

import { useBoundField } from "#field-like.ts";
import { Frame } from "#frame.tsx";

/**
 * Describes what a text field is given.
 */
export interface TextFieldProps {
  /**
   * The words of the label, where the catalogue has none and the path written out is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The kind of text box. A plain one where the caller states none.
   */
  readonly type?: "email" | "password" | "text" | undefined;
}

/**
 * Draws a text box in a frame, bound to the string field in scope.
 */
export function TextField({ label, type = "text" }: TextFieldProps): ReactElement {
  const field = useBoundField<string>();

  return (
    <Frame label={label}>
      {(control) => (
        <input
          {...control}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          type={type}
          value={field.state.value}
        />
      )}
    </Frame>
  );
}
