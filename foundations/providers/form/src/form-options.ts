/**
 * Builds the options a form over a schema is built with, so a component drawn over the form with
 * `withForm` and the hook that builds the form name one type, and assembles the library's own
 * options the hook hands the form.
 */

import { type StandardSchemaV1 } from "@standard-schema/spec";

import { defaultsOf } from "#defaults.ts";
import { defaultEngine, type Engine } from "#engine.ts";
import { formDefaults } from "#form-defaults.ts";
import { type FormDescription } from "#registry.ts";
import { type LibraryOptions, type UseSchemaFormOptions } from "#schema-form.ts";
import { type Schema } from "#schema.ts";
import { standardOf } from "#standard.ts";
import { type DraftHandle } from "#use-draft.ts";

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

/**
 * How long after a change the draft is written, in milliseconds, where the listeners state no
 * debounce of their own.
 */
const DEBOUNCE = 300;

/**
 * Assembles the library's own options for a form over a schema.
 *
 * @remarks
 *   The shared options come first and every library option the caller gave is written over them,
 *   so a caller's `validationLogic` or `onSubmitInvalid` takes precedence over the house
 *   defaults. The draft's values are written over the values given. The change listener writes
 *   the draft beside the caller's own, the submit handler forgets the draft once the caller's
 *   returns, and the schema fills the dynamic slot beside the caller's validators.
 * @typeParam Values - The form's values.
 */
export function libraryOptionsOf<Values>(
  options: UseSchemaFormOptions<Values>,
  description: Omit<FormDescription, "draft">,
  draft: DraftHandle<Values>,
): LibraryOptions<Values> {
  const {
    draft: _draft,
    engine: _engine,
    fieldOptions: _fieldOptions,
    id: _id,
    listeners,
    onSubmit,
    presentation: _presentation,
    schema: _schema,
    translate: _translate,
    validators,
    values,
    ...library
  } = options;
  const shared = schemaFormOptions<Values>(description.schema, {
    engine: description.engine,
    values: draft.restored?.values ?? values,
  });

  return {
    ...shared,
    ...library,
    listeners: {
      ...listeners,
      onChange: (props) => {
        listeners?.onChange?.(props);
        draft.write(props.formApi.state.values);
      },
      onChangeDebounceMs: listeners?.onChangeDebounceMs ?? DEBOUNCE,
    },
    onSubmit: async (props) => {
      await onSubmit?.(props);
      draft.clear();
    },
    validators: { ...validators, onDynamic: shared.validators.onDynamic },
  };
}
