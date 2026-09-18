/**
 * Draws the form element that submits the form in scope.
 */

import { type ReactElement, type ReactNode } from "react";

import { useFormContext } from "@stealthscale/provider-form";

/**
 * Describes what a form element is given.
 */
export interface FormProps {
  /**
   * The fields and the submit button.
   */
  readonly children?: ReactNode | undefined;
}

/**
 * Draws a form element whose submit runs the library's `handleSubmit`, with the browser's own
 * validation off so the schema's messages are the ones a person reads.
 */
export function Form({ children }: FormProps): ReactElement {
  const form = useFormContext();

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
}
