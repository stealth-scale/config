/**
 * Draws a number as a number box.
 */

import { type ReactElement } from "react";

import { NumberField } from "@stealthscale/example-form-fields";
import { type RendererProps } from "@stealthscale/provider-form";

import { titleOf } from "#controls/schema.ts";

/**
 * Draws a number box labelled with the schema's title.
 */
export function PlainNumber({ schema }: RendererProps): ReactElement {
  return <NumberField label={titleOf(schema)} />;
}
