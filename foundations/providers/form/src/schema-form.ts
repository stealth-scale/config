/**
 * Types what a form built from a schema is given and what it is.
 */

import { type StandardJSONSchemaV1, type StandardSchemaV1 } from "@standard-schema/spec";
import {
  type AppFieldExtendedReactFormApi,
  type createFormHook,
  type DeepKeys,
  type DeepValue,
  type FieldAsyncValidateOrFn,
  type FieldOptions,
  type FieldValidateOrFn,
  type FormAsyncValidateOrFn,
  type FormOptions,
  type FormValidateOrFn,
  type FormValidators,
} from "@tanstack/react-form";

import { type Engine } from "#engine.ts";
import { type Path } from "#path.ts";
import { type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { type Translate } from "#translate.ts";
import { type DraftOptions } from "#use-draft.ts";

/**
 * Describes a synchronous validator slot of the form, filled or not.
 */
type Sync<Values> = FormValidateOrFn<Values> | undefined;

/**
 * Describes an asynchronous validator slot of the form, filled or not.
 */
type Async<Values> = FormAsyncValidateOrFn<Values> | undefined;

/**
 * Describes the components a form hook is built with, field components and form components
 * alike, as the library constrains them.
 */
export type Components = Parameters<typeof createFormHook>[0]["fieldComponents"];

/**
 * Describes the library's own form validators a form over a schema takes beside the schema, in
 * every slot but the dynamic one, which the schema fills.
 *
 * @typeParam Values - The form's values.
 */
export type SchemaValidators<Values> = Omit<
  FormValidators<
    Values,
    Sync<Values>,
    Sync<Values>,
    Async<Values>,
    Sync<Values>,
    Async<Values>,
    Sync<Values>,
    Async<Values>,
    StandardSchemaV1<Values>,
    Async<Values>
  >,
  "onDynamic"
>;

/**
 * Describes the library's own form options as a form over a schema fills them: the schema in
 * the dynamic slot, every other slot open, and the submit meta unstated.
 *
 * @typeParam Values - The form's values.
 */
export type LibraryOptions<Values> = FormOptions<
  Values,
  Sync<Values>,
  Sync<Values>,
  Async<Values>,
  Sync<Values>,
  Async<Values>,
  Sync<Values>,
  Async<Values>,
  StandardSchemaV1<Values>,
  Async<Values>,
  Async<Values>,
  unknown
>;

/**
 * Describes the form the hook builds: the library's own form, with the schema in the dynamic
 * slot and the components bound.
 *
 * @typeParam Values - The values the form holds.
 * @typeParam FieldComponents - The components bound to a field, which `AppField` hands each
 * field.
 * @typeParam FormComponents - The components bound to the form, which the form carries.
 */
export type SchemaForm<
  Values,
  FieldComponents extends Components,
  FormComponents extends Components,
> = AppFieldExtendedReactFormApi<
  Values,
  Sync<Values>,
  Sync<Values>,
  Async<Values>,
  Sync<Values>,
  Async<Values>,
  Sync<Values>,
  Async<Values>,
  StandardSchemaV1<Values>,
  Async<Values>,
  Async<Values>,
  unknown,
  FieldComponents,
  FormComponents
>;

/**
 * Writes a presentation path as the library names the field: each `[]` as an index.
 */
type Uncollapsed<P extends string> = P extends `${infer Head}[]${infer Rest}`
  ? `${Head}[${number}]${Uncollapsed<Rest>}`
  : P;

/**
 * Describes a synchronous validator slot of one field, filled or not.
 */
type FieldSync<Values, Name extends DeepKeys<Values>> =
  | FieldValidateOrFn<Values, Name, DeepValue<Values, Name>>
  | undefined;

/**
 * Describes an asynchronous validator slot of one field, filled or not.
 */
type FieldAsync<Values, Name extends DeepKeys<Values>> =
  | FieldAsyncValidateOrFn<Values, Name, DeepValue<Values, Name>>
  | undefined;

/**
 * Describes the library's own options a form over a schema adds to one of its fields: the
 * validators, the listeners, and how its asynchronous validators run. The name and the default
 * are the foundation's.
 *
 * @typeParam Values - The form's values.
 * @typeParam Name - The field, as the library names it.
 */
export type SchemaFieldOptions<Values, Name extends DeepKeys<Values>> = Pick<
  FieldOptions<
    Values,
    Name,
    DeepValue<Values, Name>,
    FieldSync<Values, Name>,
    FieldSync<Values, Name>,
    FieldAsync<Values, Name>,
    FieldSync<Values, Name>,
    FieldAsync<Values, Name>,
    FieldSync<Values, Name>,
    FieldAsync<Values, Name>,
    FieldSync<Values, Name>,
    FieldAsync<Values, Name>
  >,
  "asyncAlways" | "asyncDebounceMs" | "listeners" | "validators"
>;

/**
 * Describes the options of a form's fields, by the path of the field each applies to.
 *
 * @remarks
 *   A path is written as the presentation writes it, with `[]` for an array's items, so one entry
 *   covers every row of a repeat group. Each entry is typed over the value at that path, so a
 *   validator reads the value as the field holds it.
 * @typeParam Values - The form's values.
 */
export type FieldOptionsByPath<Values> = {
  readonly [P in Path<Values>]?: Uncollapsed<P> extends infer Name extends DeepKeys<Values>
    ? SchemaFieldOptions<Values, Name>
    : never;
};

/**
 * Describes where a form's draft is kept.
 */
export interface DraftScope extends Pick<DraftOptions, "app" | "store"> {
  /**
   * The identifier the draft is kept under. The form's identifier where this is absent, and
   * something an edit form makes from the record's identifier where a draft is kept per record.
   */
  readonly id?: string | undefined;
}

/**
 * Describes what a form built from a schema is given: the library's own form options, less the
 * defaults and the validators the schema fills, and what the schema adds.
 *
 * @remarks
 *   `onSubmit` receives the library's own props. The draft is forgotten once it returns. A
 *   `listeners.onChange` runs beside the draft's own, under the debounce the listeners state or
 *   the foundation's.
 * @typeParam Values - The form's values, stated by the caller. A schema carries no static type.
 */
export interface UseSchemaFormOptions<Values> extends Omit<
  LibraryOptions<Values>,
  "defaultValues" | "validators"
> {
  /**
   * Where the form is kept across a refresh. The form keeps no draft where this is absent.
   */
  readonly draft?: DraftScope | undefined;

  /**
   * The engine that evaluates the schema. The provider's, or the default engine, where this is
   * absent.
   */
  readonly engine?: Engine | undefined;

  /**
   * The library's own field options, by the path of the field each applies to, which the form
   * writes onto each field it draws.
   */
  readonly fieldOptions?: FieldOptionsByPath<Values> | undefined;

  /**
   * The identifier every message identifier of the form begins with. The presentation's, the
   * schema's `x-form.id`, or `form`, where this is absent.
   */
  readonly id?: string | undefined;

  /**
   * How the form is drawn, stated beside the schema. Takes precedence over the schema's own
   * keywords per field.
   */
  readonly presentation?: Presentation<Values> | undefined;

  /**
   * The schema, as a document or as a library object that converts itself to one.
   */
  readonly schema: Schema | StandardJSONSchemaV1;

  /**
   * The translator every word of the form goes through. The provider's where this is absent.
   */
  readonly translate?: Translate | undefined;

  /**
   * The library's own form validators, in every slot but the dynamic one.
   */
  readonly validators?: SchemaValidators<Values> | undefined;

  /**
   * The values an edit form starts from, written over the schema's defaults. A draft's values
   * are written over these.
   */
  readonly values?: Partial<Values> | undefined;
}
