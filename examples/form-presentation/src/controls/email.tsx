/**
 * Draws a string with the email format as an email box.
 */

import { type ReactElement } from "react";

import { TextField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

import { titleOf } from "#controls/schema.ts";

/**
 * Draws an email box labelled with the schema's title.
 */
export function Email({ schema }: RendererProps): ReactElement {
  return <TextField label={titleOf(schema)} type="email" />;
}
