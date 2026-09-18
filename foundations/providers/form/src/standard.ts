/**
 * Wraps a JSON Schema as the Standard Schema the form library validates with, so a schema goes in
 * a validator slot and the library does the rest.
 */

import { type StandardSchemaV1 } from "@standard-schema/spec";

import { defaultEngine, type Engine } from "#engine.ts";
import { type Issue } from "#issues.ts";
import { type Schema } from "#schema.ts";

/**
 * Wraps a schema as a Standard Schema over the engine.
 *
 * @remarks
 *   Handed to a form's validator slot, the library runs it over the whole value, puts each issue
 *   on the field at its path, and keeps an issue at the root under the empty name. Handed to a
 *   field's validator slot, it runs over the field's value alone, so a property's schema fits
 *   there. Every issue keeps its `keyword` and `values`, which is what the frame reads a message
 *   for. The schema is checked for a `format` no `Format` was registered for before anything
 *   else.
 * @typeParam Values - The form's values, which the caller states. A schema carries no static type.
 * @throws {@link Error} Where the schema names a `format` the engine has no `Format` for.
 */
export function standardOf<Values = unknown>(
  schema: Schema,
  engine: Engine = defaultEngine(),
): StandardSchemaV1<Values> {
  engine.check(schema);

  /**
   * Reports whether the value passed the schema, which the caller's type describes.
   */
  // eslint-disable-next-line unicorn/consistent-function-scoping -- the guard names the type parameter of the function that declares it
  const conforms = (value: unknown, issues: readonly Issue[]): value is Values =>
    issues.length === 0;

  return {
    "~standard": {
      validate: (value) => {
        const issues = engine.validate(schema, value);

        return conforms(value, issues) ? { value } : { issues };
      },
      vendor: "stealthscale",
      version: 1,
    },
  };
}
