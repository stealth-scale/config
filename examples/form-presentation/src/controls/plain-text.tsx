/**
 * Draws a string as a text box.
 */

import { type ReactElement } from "react";

import { TextField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

import { titleOf } from "#controls/schema.ts";

/**
 * Draws a string as a text box labelled with the schema's title.
 */
export function PlainText({ schema }: RendererProps): ReactElement {
  return <TextField label={titleOf(schema)} />;
}
