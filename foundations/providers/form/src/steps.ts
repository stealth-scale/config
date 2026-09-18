/**
 * Validates a step of a form before a person leaves it.
 */

import {
  type AnyFieldLikeMetaBase,
  type AnyFieldMeta,
  type Updater,
  type ValidationCause,
} from "@tanstack/react-form";

import { focusFirstInvalid, type Invalidated } from "#form-defaults.ts";

/**
 * Describes what a form is read and told when a step of it is left.
 *
 * @remarks
 *   The members are the library's own, written as methods so that a form typed over its own
 *   values satisfies the shape as well as one typed over any values.
 */
export interface Steppable extends Invalidated {
  /**
   * Reads the state of a field by its path, or nothing where the field was never mounted.
   */
  // eslint-disable-next-line typescript/method-signature-style -- a method is compared both ways, which is what lets a form typed over its own values satisfy this shape
  getFieldMeta(field: string): AnyFieldMeta | undefined;

  /**
   * Changes the state of a field by its path.
   */
  // eslint-disable-next-line typescript/method-signature-style -- the same, for the change
  setFieldMeta(field: string, updater: Updater<AnyFieldLikeMetaBase>): void;

  /**
   * Validates a field by its path for a cause, which runs the form's validators for that cause
   * as well.
   */
  // eslint-disable-next-line typescript/method-signature-style -- the same, for the validation
  validateField(field: string, cause: ValidationCause): Promise<unknown> | readonly unknown[];
}

/**
 * Validates the fields of a step and reports whether a person may leave it.
 *
 * @remarks
 *   Every mounted field of the step is marked touched, so its error shows, and `validateField`
 *   runs once with the cause `submit`, which runs every form-level validator and the first
 *   field's own. Calling it once per field would run the schema and every form validator once
 *   per field, requests included. Where a field of the step is refused, focus moves to the first
 *   field with an error.
 * @returns Whether every field of the step passed.
 */
export async function leaveStep(form: Steppable, paths: readonly string[]): Promise<boolean> {
  const mounted = paths.filter((path) => form.getFieldMeta(path) !== undefined);

  for (const path of mounted) form.setFieldMeta(path, (meta) => ({ ...meta, isTouched: true }));

  const [first] = mounted;

  if (first === undefined) return true;

  await form.validateField(first, "submit");

  const refused = mounted.some((path) => form.getFieldMeta(path)?.isValid === false);

  if (refused) focusFirstInvalid(form);

  return !refused;
}
