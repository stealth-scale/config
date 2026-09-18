/**
 * Draws the region a generated form's own errors are read from.
 */

import { type ReactElement } from "react";

import { type ErrorsProps } from "@stealthscale/provider-form";

/**
 * Draws the region the form's own errors are read from, one paragraph per error.
 *
 * @remarks
 *   The region is on the page from the first render and empty until the schema or a form
 *   validator refuses the whole value, so a screen reader announces the words as they arrive. The
 *   tab index is there because the foundation moves focus to the region when a submit is refused
 *   and no field holds the error.
 */
export function Errors({ errors, id }: ErrorsProps): ReactElement {
  return (
    <div className="errors" id={id} role="alert" tabIndex={-1}>
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
