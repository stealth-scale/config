/**
 * Reads the errors that belong to the form as a whole rather than to one of its fields.
 */

import { useSelector } from "@tanstack/react-form";

import { useAnyForm } from "#contexts.ts";
import { isSchema } from "#walk.ts";

/**
 * Reports whether two lists hold the same errors in the same order.
 *
 * @remarks
 *   The engine builds its issues anew on every validation, and a form validator returning an
 *   object literal does the same, so the lists are compared by what they wrote rather than by
 *   identity. The library compares a selection by identity alone, and the list is built anew on
 *   every read, so without this the region re-renders on every change to the form.
 */
function sameErrors(one: readonly unknown[], other: readonly unknown[]): boolean {
  return JSON.stringify(one) === JSON.stringify(other);
}

/**
 * Lists the errors one validator slot reports for the form as a whole.
 *
 * @remarks
 *   The library keeps a slot's form-level error as whatever the validator returned for the form.
 *   A schema in the dynamic slot reports its issues by path, with the root's under the empty
 *   path. A validator of the caller's own returns a value of its choosing, and one that is not a
 *   map by path is the form's own error as it is.
 */
function errorsIn(slot: unknown): readonly unknown[] {
  if (slot === undefined || slot === null) return [];

  if (!isSchema(slot)) return [slot];

  const root: unknown = slot[""];

  return Array.isArray(root) ? root : [];
}

/**
 * Lists the errors of the form as a whole: every slot's issues at the root of the schema, and
 * every value a form validator returned for the whole form.
 */
export function rootErrorsOf(errorMap: Readonly<Record<string, unknown>>): readonly unknown[] {
  return Object.values(errorMap).flatMap((slot) => errorsIn(slot));
}

/**
 * Reads the errors of the form in scope as a whole, re-rendering the reader only where they
 * change.
 *
 * @remarks
 *   These are the errors no field shows: an issue at the root of the schema, such as a `oneOf`
 *   no branch of which matched, and whatever a form validator returned for the whole value. The
 *   region `Fields` draws reads them, and a refused submit no field accounts for moves focus to
 *   it.
 */
export function useRootErrors(): readonly unknown[] {
  const form = useAnyForm();

  return useSelector(form.store, (state) => rootErrorsOf(state.errorMap), {
    compare: sameErrors,
  });
}
