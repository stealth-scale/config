/**
 * Draws the signup form, whose rules come from four places: the schema, the engine, a field
 * validator and a form validator.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/example-form-fields";

import { isTaken } from "#accounts.ts";
import { apart } from "#apart.ts";
import { type Signup, signup } from "#schema.ts";

/**
 * Describes what the signup form is given.
 */
export interface SignupFormProps {
  /**
   * Receives the values once every rule passes.
   */
  readonly onDone: (value: Signup) => void;
}

/**
 * Draws the signup form by hand, over a form built from its schema.
 *
 * @remarks
 *   The schema goes in the dynamic slot with the page's engine, so the VAT format and the
 *   matching keyword apply. The username asks the accounts service on blur, debounced, through
 *   the library's own field validator, and the library skips that request while the schema
 *   refuses the field. The rule across the password and the username is a form validator in the
 *   submit slot. The VAT field is drawn by `form.Fields`, which draws it where the schema
 *   resolved against the values has it.
 */
export function SignupForm({ onDone }: SignupFormProps): ReactElement {
  const form = useSchemaForm<Signup>({
    onSubmit: ({ value }) => {
      onDone(value);
    },
    schema: signup,
    validators: { onSubmit: apart },
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="kind">{(field) => <field.Select />}</form.AppField>
        <form.Fields of={["vat"]} />
        <form.AppField
          name="username"
          validators={{
            onBlurAsync: async ({ signal, value }) =>
              (await isTaken(value, signal)) ? { keyword: "taken" } : undefined,
            onBlurAsyncDebounceMs: 50,
          }}
        >
          {(field) => <field.Text />}
        </form.AppField>
        <form.AppField name="password">{(field) => <field.Text />}</form.AppField>
        <form.AppField name="confirm">{(field) => <field.Text />}</form.AppField>
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
