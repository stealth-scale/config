/**
 * Builds the options a form over a schema is built with, so a component drawn over the form with
 * `withForm` and the hook that builds the form name one type.
 */

import { type StandardSchemaV1 } from "@standard-schema/spec";

import { defaultsOf } from "#defaults.ts";
import { defaultEngine, type Engine } from "#engine.ts";
import { formDefaults } from "#form-defaults.ts";
import { type Schema } from "#schema.ts";
import { standardOf } from "#standard.ts";

/**
 * Describes the options every form starts from.
 */
type FormDefaults = typeof formDefaults;

/**
 * Describes the options a form over a schema is built with: the house defaults, the schema's
 * defaults to start from, and the schema in the dynamic slot.
 *
 * @typeParam Values - The form's values, stated by the caller.
 */
export interface SchemaFormOptions<Values> extends FormDefaults {
  /**
   * The values the form starts from.
   */
  readonly defaultValues: Values;

  /**
   * The schema, as the Standard Schema the library validates with, in the dynamic slot.
   */
  readonly validators: {
    /**
     * The schema, which validates on submit and then on every change.
     */
    readonly onDynamic: StandardSchemaV1<Values>;
  };
}

/**
 * Describes what the options are built with beyond the schema.
 *
 * @typeParam Values - The form's values, stated by the caller.
 */
export interface SchemaFormStart<Values> {
  /**
   * The engine that evaluates the schema. The default engine where this is absent.
   */
  readonly engine?: Engine | undefined;

  /**
   * The values an edit form starts from, written over the schema's defaults.
   */
  readonly values?: Partial<Values> | undefined;
}

/**
 * Builds the options a form over a schema is built with.
 *
 * @remarks
 *   A component drawn over the form with `withForm` spreads these to name the form's type, and
 *   the form the hook builds carries them, so the two sides agree. A form whose schema names a
 *   format the default engine lacks hands in the engine that has it.
 * @typeParam Values - The form's values, stated by the caller.
 * @throws {@link Error} Where the schema names a `format` the engine has no `Format` for.
 */
export function schemaFormOptions<Values>(
  schema: Schema,
  start?: SchemaFormStart<Values>,
): SchemaFormOptions<Values> {
  const { engine = defaultEngine(), values } = start ?? {};

  return {
    ...formDefaults,
    defaultValues: defaultsOf<Values>(schema, values, engine),
    validators: { onDynamic: standardOf<Values>(schema, engine) },
  };
}
