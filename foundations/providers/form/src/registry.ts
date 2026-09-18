/**
 * Keeps what describes a form built from a schema, keyed by the form, so a bound component reads
 * the schema, the presentation and the translator of the form it is drawing.
 */

import { type AnyFieldApi } from "@tanstack/react-form";

import { type Engine } from "#engine.ts";
import { type Layouts } from "#layouts.ts";
import { type Presentation } from "#presentation.ts";
import { type Renderer } from "#renderer.ts";
import { type Schema } from "#schema.ts";
import { type Translate } from "#translate.ts";
import { type DraftHandle } from "#use-draft.ts";

/**
 * Describes the library's own options a generated field takes beside its name and its default,
 * typed over any field: the validators, the listeners, and how its asynchronous validators run.
 */
export type FieldRules = Pick<
  AnyFieldApi["options"],
  "asyncAlways" | "asyncDebounceMs" | "listeners" | "validators"
>;

/**
 * Describes a form built from a schema: what it validates with, what it is drawn from, and what
 * draws it.
 */
export interface FormDescription {
  /**
   * The draft the form is kept in across a refresh, or one that keeps nothing.
   */
  readonly draft: DraftHandle<unknown>;

  /**
   * The engine that evaluates the schema.
   */
  readonly engine: Engine;

  /**
   * The library's own field options, by the path of the field each applies to.
   */
  readonly fieldOptions: Readonly<Partial<Record<string, FieldRules>>>;

  /**
   * The identifier every message identifier of the form begins with.
   */
  readonly id: string;

  /**
   * The components that lay the fields out.
   */
  readonly layouts: Layouts;

  /**
   * How the form is drawn, read from the schema and the call site.
   */
  readonly presentation: Presentation;

  /**
   * The renderers a field is drawn by, in registration order.
   */
  readonly renderers: readonly Renderer[];

  /**
   * The schema the form is built from.
   */
  readonly schema: Schema;

  /**
   * The translator every word of the form goes through.
   */
  readonly translate: Translate;
}

/**
 * Describes the member of a form the registry keys by.
 *
 * @remarks
 *   The library hands a component a copy of the form it built, and hands a field the form itself,
 *   so neither object keys the other's description. Both share the store underneath.
 */
export interface Described {
  /**
   * The store the form keeps its state in.
   */
  readonly baseStore: object;
}

/**
 * The descriptions of every form built from a schema, by the store of each.
 */
const described = new WeakMap<object, FormDescription>();

/**
 * Keeps the description of a form.
 */
export function describeForm(form: Described, description: FormDescription): void {
  described.set(form.baseStore, description);
}

/**
 * Reads the description of a form.
 *
 * @returns The description, or nothing for a form that was not built from a schema.
 */
export function descriptionOf(form: Described): FormDescription | undefined {
  return described.get(form.baseStore);
}

/**
 * Reads the description of a form that a component drawing from a schema needs.
 *
 * @throws {@link Error} When the form was not built from a schema.
 */
export function describedForm(form: Described): FormDescription {
  const description = descriptionOf(form);

  if (description === undefined) {
    throw new Error("The form was not built with useSchemaForm, so no schema describes it");
  }

  return description;
}
