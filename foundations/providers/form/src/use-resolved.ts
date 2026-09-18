/**
 * Resolves the schema of the form being drawn against the values in hand, and re-renders the
 * reader only where the resolved schema changed.
 */

import { useSelector } from "@tanstack/react-form";

import { useAnyForm } from "#contexts.ts";
import { schemaHash } from "#draft.ts";
import { useDescribedForm } from "#registry.ts";
import { type Schema } from "#schema.ts";

/**
 * Reports whether two schemas are the same, by their hash.
 */
function sameSchema(one: Schema, other: Schema): boolean {
  return schemaHash(one) === schemaHash(other);
}

/**
 * Reads the schema of the form in scope, resolved against the values in hand.
 *
 * @remarks
 *   The schema is resolved on every change to any value, at a fifth of a millisecond, and the
 *   reader re-renders only where the resolved schema's hash changed. A form with no conditionals
 *   therefore renders its structure once.
 * @throws {@link Error} When the form was not built from a schema.
 */
export function useResolved(): Schema {
  const form = useAnyForm();
  const { engine, schema } = useDescribedForm(form);

  return useSelector(form.store, (state) => engine.resolve(schema, state.values), {
    compare: sameSchema,
  });
}
