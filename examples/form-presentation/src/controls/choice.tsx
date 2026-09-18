/**
 * Draws a string with an `enum` as a select over its choices.
 */

import { type ReactElement } from "react";

import { SelectField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

import { choicesOf, titleOf } from "#controls/schema.ts";

/**
 * Draws a select over the string choices the schema lists, labelled with the schema's title.
 */
export function Choice({ schema }: RendererProps): ReactElement {
  return <SelectField label={titleOf(schema)} options={choicesOf(schema)} />;
}
