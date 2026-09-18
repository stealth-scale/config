/**
 * Keeps what describes a form built from a schema, keyed by the form, so a bound component reads
 * the schema, the presentation and the translator of the form it is drawing, and is drawn again
 * when any of them changes.
 */

import { useLayoutEffect, useSyncExternalStore } from "react";

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
 * Describes how a reader follows one form's description.
 *
 * @remarks
 *   Built once per form, because a reader is subscribed by the identity of the function it was
 *   given, and a fresh one each render would drop and rebuild the subscription each render.
 */
interface Reader {
  /**
   * Reads the description as it stands, or nothing for a form nothing describes.
   */
  readonly read: () => FormDescription | undefined;

  /**
   * Tells a reader whenever the description changes.
   *
   * @returns How to stop.
   */
  readonly subscribe: (onChange: () => void) => () => void;
}

/**
 * Describes what the registry keeps for one form: the description, the readers following it, and
 * how a reader follows it.
 */
interface Entry extends Reader {
  /**
   * The description as it stands.
   */
  current: FormDescription;

  /**
   * The readers to tell when the description changes.
   */
  readonly listeners: Set<() => void>;
}

/**
 * Stops nothing, for a reader that was told nothing.
 */
function none(): void {
  return undefined;
}

/**
 * The reader given for a form nothing describes, which reads nothing and follows nothing.
 */
const IDLE: Reader = { read: () => {}, subscribe: () => none };

/**
 * The entries of every form built from a schema, by the store of each.
 */
const entries = new WeakMap<object, Entry>();

/**
 * Builds the entry of one form.
 */
function entryOf(description: FormDescription): Entry {
  const listeners = new Set<() => void>();
  const entry: Entry = {
    current: description,
    listeners,
    read: () => entry.current,
    subscribe: (onChange) => {
      listeners.add(onChange);

      return () => {
        listeners.delete(onChange);
      };
    },
  };

  return entry;
}

/**
 * Reports whether two lists of renderers hold the same renderers in the same order.
 */
function sameRenderers(one: readonly Renderer[], other: readonly Renderer[]): boolean {
  return one.length === other.length && one.every((renderer, at) => renderer === other[at]);
}

/**
 * Reports whether two descriptions describe the form the same way, member by member.
 *
 * @remarks
 *   Every member is compared by identity but the renderers, which the hook lists afresh from the
 *   package's and the provider's and are compared one by one.
 */
function sameDescription(one: FormDescription, other: FormDescription): boolean {
  return (
    one.draft === other.draft &&
    one.engine === other.engine &&
    one.fieldOptions === other.fieldOptions &&
    one.id === other.id &&
    one.layouts === other.layouts &&
    one.presentation === other.presentation &&
    one.schema === other.schema &&
    one.translate === other.translate &&
    sameRenderers(one.renderers, other.renderers)
  );
}

/**
 * Keeps the description of a form, and tells every reader following it where it changed.
 *
 * @remarks
 *   The first description of a form is kept as it is. A later one that describes the form the
 *   same way, member by member, changes nothing and tells nobody, so a hook that describes its
 *   form on every render costs its readers nothing while the form stays the same.
 */
export function describeForm(form: Described, description: FormDescription): void {
  const entry = entries.get(form.baseStore);

  if (entry === undefined) {
    entries.set(form.baseStore, entryOf(description));

    return;
  }

  if (sameDescription(entry.current, description)) return;

  entry.current = description;

  for (const listener of entry.listeners) listener();
}

/**
 * Describes a form from the hook that builds it, on every render.
 *
 * @remarks
 *   The form is described while it first renders, so the fields it draws in that render read the
 *   description, and again in a layout effect on every render after, so a reader following the
 *   description is drawn again before the browser paints when the description changed. Nobody
 *   follows the description before the first render commits, which is why the first write is
 *   safe to make while rendering.
 */
export function useDescribeForm(form: Described, description: FormDescription): void {
  if (descriptionOf(form) === undefined) describeForm(form, description);

  useLayoutEffect(() => {
    describeForm(form, description);
  });
}

/**
 * Reads the description of a form.
 *
 * @returns The description, or nothing for a form that was not built from a schema.
 */
export function descriptionOf(form: Described): FormDescription | undefined {
  return entries.get(form.baseStore)?.current;
}

/**
 * Reads the description of a form and follows it, so the reader is drawn again when the
 * description changes.
 *
 * @remarks
 *   The description is read through `useSyncExternalStore` over the form's entry, so a component
 *   that reads the translator or the presentation off the form is drawn again when the hook
 *   describes the form differently, whether or not anything above it re-renders it. A form
 *   nothing describes reads nothing and follows nothing.
 * @returns The description, or nothing for a form that was not built from a schema.
 */
export function useDescribed(form: Described): FormDescription | undefined {
  const reader: Reader = entries.get(form.baseStore) ?? IDLE;

  return useSyncExternalStore(reader.subscribe, reader.read, reader.read);
}

/**
 * Reads the description of a form that a component drawing from a schema needs, and follows it.
 *
 * @throws {@link Error} When the form was not built from a schema.
 */
export function useDescribedForm(form: Described): FormDescription {
  const description = useDescribed(form);

  if (description === undefined) {
    throw new Error("The form was not built with useSchemaForm, so no schema describes it");
  }

  return description;
}
