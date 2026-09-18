/**
 * Fixes how a form in this design system behaves before an application says otherwise.
 */

import { revalidateLogic } from "@tanstack/react-form";

/**
 * Describes the state of one field a refused submit is read for.
 */
interface FieldErrors {
  /**
   * The errors the field shows, from every slot.
   */
  readonly errors: readonly unknown[];
}

/**
 * Describes what a form whose submit was refused is read for: the fields and their errors.
 *
 * @remarks
 *   The values are left out on purpose. A shape naming them would hand the library a candidate
 *   for the form's values type when the defaults are spread into its options, and that candidate
 *   would be `unknown`. Every form the library builds satisfies this shape.
 */
export interface Invalidated {
  /**
   * The state as it is now, as far as the fields go.
   */
  readonly state: {
    /**
     * The state of every field the form has met, by path.
     */
    readonly fieldMeta: Readonly<Partial<Record<string, FieldErrors>>>;
  };
}

/**
 * Moves focus to the first field with an error, in the order the form met its fields.
 *
 * @remarks
 *   A control is found by the `name` attribute the bound field writes, which is the field's path.
 *   A submit that fails without moving focus leaves a keyboard or screen reader user with no way
 *   to find the problem.
 */
export function focusFirstInvalid(form: Invalidated): void {
  const found = Object.entries(form.state.fieldMeta).find(
    ([, meta]) => meta !== undefined && meta.errors.length > 0,
  );

  if (found === undefined) return;

  const control = document.querySelector(`[name="${CSS.escape(found[0])}"]`);

  if (control instanceof HTMLElement) control.focus();
}

/**
 * Describes what a refused submit reports: the form that refused.
 */
interface SubmitRefused {
  /**
   * The form that refused.
   */
  readonly formApi: Invalidated;
}

/**
 * The options every form starts from, spread before its own.
 *
 * @remarks
 *   Validation runs on submit and then on every change after the first submit attempt, which is
 *   the library's own `revalidateLogic` with its defaults. A refused submit moves focus to the
 *   first field with an error.
 */
export const formDefaults = {
  onSubmitInvalid: ({ formApi }: SubmitRefused): void => {
    focusFirstInvalid(formApi);
  },
  validationLogic: revalidateLogic(),
} as const;
