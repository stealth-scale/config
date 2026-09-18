/**
 * Builds the values a form starts from, out of the schema that knows them.
 */

import { defaultEngine, type Engine } from "#engine.ts";
import { type Schema } from "#schema.ts";

/**
 * Builds the values a form starts from: every property the schema lists, with `default` keywords
 * applied and the values given written over them.
 *
 * @remarks
 *   A string with no default is `""`, a boolean `false`, an array `[]` and an object every one of
 *   its properties, so every control is controlled from the first render. An `enum` or a `const`
 *   with no default starts from the same empty value, so a select opens on no choice and a box a
 *   person has to tick starts unticked. An edit form hands in the values it starts from, and they
 *   are kept over the defaults. The engine reads the schema, and the default engine does where a
 *   caller states none.
 * @typeParam Values - The form's values, stated by the caller. A schema carries no static type.
 */
export function defaultsOf<Values>(
  schema: Schema,
  values?: Partial<Values>,
  engine: Engine = defaultEngine(),
): Values {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the engine builds a value that satisfies the schema, and the schema is what the caller's type describes
  return engine.defaults(schema, values) as Values;
}
