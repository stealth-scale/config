/**
 * Reads what a control needs off a property's schema.
 */

import { type Schema } from "@stealthscale/provider-form";

/**
 * Reads the title a schema states, which is the label's development text.
 */
export function titleOf(schema: Schema): string | undefined {
  const { title } = schema;

  return typeof title === "string" ? title : undefined;
}

/**
 * Reads the choices a schema lists under `enum`, strings alone.
 */
export function choicesOf(schema: Schema): readonly string[] {
  const { enum: choices } = schema;

  return Array.isArray(choices)
    ? choices.filter((choice): choice is string => typeof choice === "string")
    : [];
}
