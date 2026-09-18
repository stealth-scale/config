/**
 * Draws a number with a currency beside it, read from the field's options.
 */

import { type ReactElement } from "react";

import { NumberField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

/**
 * Draws a number box with the currency the field's options name beside it, or nothing where
 * the option is not a string.
 */
export function Amount({ presentation, required }: RendererProps): ReactElement {
  const currency = presentation.options?.["currency"];

  return (
    <div className="amount">
      <NumberField required={required} />
      <span>{typeof currency === "string" ? currency : ""}</span>
    </div>
  );
}
