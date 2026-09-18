/**
 * Draws a multi-line text box, which is the control this page adds that the field library lacks.
 */

import { type ReactElement } from "react";

import { Frame, useBoundField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

/**
 * Draws a multi-line text box in a frame, bound to the string field in scope.
 */
export function Textarea({ required }: RendererProps): ReactElement {
  const field = useBoundField<string>();

  return (
    <Frame required={required}>
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
