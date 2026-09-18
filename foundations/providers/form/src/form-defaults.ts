/**
 * Fixes how a form in this design system behaves before an application says otherwise, and moves
 * focus to a control by the name the bound field writes.
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
   * The identifier the form's element carries, where the form component writes it, so a control
   * is found inside this form rather than the first on the page.
   */
  readonly formId?: string | undefined;

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
 * Moves focus to the control bound to a field.
 *
 * @remarks
 *   The control is found by the `name` attribute the bound field writes, which is the field's
 *   path, inside the element carrying the form's identifier where one is given and it is on the
 *   page, and anywhere on the page otherwise. Nothing happens where no control carries the name.
 * @param name - The field's path, as the bound field writes it.
 * @param formId - The identifier of the form's element, which the form component writes as its
 *   `id`, so two forms on one page naming the same field each focus their own control.
 */
export function focusControl(name: string, formId?: string): void {
  const control = `[name="${CSS.escape(name)}"]`;
  const inside =
    formId === undefined ? null : document.querySelector(`[id="${CSS.escape(formId)}"]`);
  const found = inside?.querySelector(control) ?? document.querySelector(control);

  if (found instanceof HTMLElement) found.focus();
}

/**
 * Moves focus to the first field with an error, in the order the form met its fields.
 *
 * @remarks
 *   A submit that fails without moving focus leaves a keyboard or screen reader user with no way
 *   to find the problem.
 */
export function focusFirstInvalid(form: Invalidated): void {
  const found = Object.entries(form.state.fieldMeta).find(
    ([, meta]) => meta !== undefined && meta.errors.length > 0,
  );

  if (found !== undefined) focusControl(found[0], form.formId);
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
