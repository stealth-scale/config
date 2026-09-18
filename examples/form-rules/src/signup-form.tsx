/**
 * Draws the signup form, whose rules come from four places: the schema, the engine, a field
 * validator and a form validator.
 */

import { type ReactElement } from "react";

import { useAppForm } from "@stealthscale/example-form-fields";
import {
  defaultsOf,
  formDefaults,
  standardOf,
  useFormEnvironment,
  useSelector,
} from "@stealthscale/provider-form";

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
 * Draws the signup form.
 *
 * @remarks
 *   The schema goes in the dynamic slot with the page's engine, so the VAT format and the
 *   matching keyword apply. The username asks the accounts service on blur, debounced, through
 *   the library's own field validator, and the library skips that request while the schema
 *   refuses the field. The rule across the password and the username is a form validator in the
 *   submit slot. The VAT field is drawn where the schema resolved against the values requires it.
 */
export function SignupForm({ onDone }: SignupFormProps): ReactElement {
  const { engine } = useFormEnvironment();
  const form = useAppForm({
    ...formDefaults,
    defaultValues: defaultsOf<Signup>(signup, undefined, engine),
    onSubmit: ({ value }) => {
      onDone(value);
    },
    validators: { onDynamic: standardOf<Signup>(signup, engine), onSubmit: apart },
  });
  const kind = useSelector(form.store, (state) => state.values.kind);
  const required = engine.resolve(signup, { kind })["required"];
  const business = Array.isArray(required) && required.includes("vat");

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="kind">
          {(field) => <field.Select options={["business", "individual"]} />}
        </form.AppField>
        {business ? <form.AppField name="vat">{(field) => <field.Text />}</form.AppField> : null}
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
        <form.AppField name="password">{(field) => <field.Text type="password" />}</form.AppField>
        <form.AppField name="confirm">{(field) => <field.Text type="password" />}</form.AppField>
        <form.Submit>Sign up</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}
