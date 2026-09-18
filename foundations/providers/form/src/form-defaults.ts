/**
 * Fixes how a form in this design system behaves before an application says otherwise.
 */

import { revalidateLogic } from "@tanstack/react-form";

import { focusFirstInvalid, type Invalidated } from "#focus.ts";

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
 *   first field with an error, or to the form's errors region where no field carries one.
 */
export const formDefaults = {
  onSubmitInvalid: ({ formApi }: SubmitRefused): void => {
    focusFirstInvalid(formApi);
  },
  validationLogic: revalidateLogic(),
} as const;
