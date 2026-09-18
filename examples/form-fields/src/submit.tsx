/**
 * Draws the button that submits the form in scope.
 */

import { type ReactElement, type ReactNode } from "react";

import { useFormContext } from "@stealthscale/provider-form";

/**
 * Describes what a submit button is given.
 */
export interface SubmitProps {
  /**
   * The words on the button. "Submit" where the caller states none.
   */
  readonly children?: ReactNode | undefined;
}

/**
 * Draws a submit button, disabled while the form is submitting.
 *
 * @remarks
 *   The button stays enabled while the form is invalid, because the library moves focus to the
 *   first refused field on a submit attempt, and a disabled button would never let that happen.
 */
export function Submit({ children = "Submit" }: SubmitProps): ReactElement {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button disabled={isSubmitting} type="submit">
          {children}
        </button>
      )}
    </form.Subscribe>
  );
}
