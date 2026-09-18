/**
 * Draws a text box bound to a string field.
 */

import { type ReactElement } from "react";

import { useProperty } from "@stealthscale/provider-form";

import { useBoundField } from "#field-like.ts";
import { type FieldProps, Frame } from "#frame.tsx";

/**
 * Describes what a text field is given.
 */
export interface TextFieldProps extends FieldProps {
  /**
   * The kind of text box. The kind the schema's `format` names, or a plain one, where the caller
   * states none.
   */
  readonly type?: "email" | "password" | "text" | undefined;
}

/**
 * Draws a text box in a frame, bound to the string field in scope.
 *
 * @remarks
 *   A property with `format: "email"` draws an email box and one with `format: "password"` a
 *   password box, so a form generated from a schema states neither.
 */
export function TextField({ label, required, type }: TextFieldProps): ReactElement {
  const field = useBoundField<string>();
  const { schema } = useProperty();
  const format = schema?.["format"];
  const kind = type ?? (format === "email" || format === "password" ? format : "text");

  return (
    <Frame label={label} required={required}>
      {(control) => (
        <input
          {...control}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          type={kind}
          value={field.state.value}
        />
      )}
    </Frame>
  );
}
