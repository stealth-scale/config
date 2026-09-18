/**
 * Draws a multi-line text box, which is the control this page adds that the field library lacks.
 */

import { type ReactElement } from "react";

import { Frame, useBoundField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

import { titleOf } from "#controls/schema.ts";

/**
 * Draws a multi-line text box in a frame, bound to the string field in scope.
 */
export function Textarea({ schema }: RendererProps): ReactElement {
  const field = useBoundField<string>();

  return (
    <Frame label={titleOf(schema)}>
      {(control) => (
        <textarea
          {...control}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          value={field.state.value}
        />
      )}
    </Frame>
  );
}
