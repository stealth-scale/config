/**
 * Registers the renderers a generated form is drawn with: one per type, and a select for a
 * string with an `enum`.
 */

import { RANK, type Renderer } from "@stealthscale/provider-form";

import { CheckboxField } from "#checkbox.tsx";
import { NumberField } from "#number.tsx";
import { SelectField } from "#select.tsx";
import { TextField } from "#text.tsx";

/**
 * Lists the renderers in registration order. An application's renderers come after them, and
 * the later of two renderers ranking the same is picked, so an application overrides one by
 * registering its own.
 */
export const renderers: readonly Renderer[] = [
  { draw: TextField, suits: (_, schema) => (schema["type"] === "string" ? RANK.type : undefined) },
  {
    draw: NumberField,
    suits: (_, schema) =>
      schema["type"] === "number" || schema["type"] === "integer" ? RANK.type : undefined,
  },
  {
    draw: CheckboxField,
    suits: (_, schema) => (schema["type"] === "boolean" ? RANK.type : undefined),
  },
  {
    draw: SelectField,
    suits: (_, schema) => (Array.isArray(schema["enum"]) ? RANK.constraint : undefined),
  },
];
