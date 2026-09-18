/**
 * Draws the contact form, generated from its schema, with every word read under `contact`.
 */

import { type ReactElement } from "react";

import { useAppForm, useWords } from "@stealthscale/example-form-fields";
import {
  defaultsOf,
  formDefaults,
  standardOf,
  useFormEnvironment,
} from "@stealthscale/provider-form";

import { type Contact, contact } from "#schema.ts";

/**
 * Describes what the contact form is given.
 */
export interface ContactFormProps {
  /**
   * Receives the values once they pass the schema.
   */
  readonly onSent: (value: Contact) => void;
}

/**
 * Draws the contact form: the schema's defaults to start from, the schema in the dynamic slot so
 * it validates on submit and then on every change, and two fieldsets whose legends and fields
 * read their words under `contact`.
 */
export function ContactForm({ onSent }: ContactFormProps): ReactElement {
  const words = useWords();
  const { translate } = useFormEnvironment();
  const form = useAppForm({
    ...formDefaults,
    defaultValues: defaultsOf<Contact>(contact),
    onSubmit: ({ value }) => {
      onSent(value);
    },
    validators: { onDynamic: standardOf<Contact>(contact) },
  });

  return (
    <form.AppForm>
      <form.Form>
        <fieldset>
          <legend>{words.legend("who")}</legend>
          <form.AppField name="name">{(field) => <field.Text />}</form.AppField>
          <form.AppField name="email">{(field) => <field.Text type="email" />}</form.AppField>
        </fieldset>
        <fieldset>
          <legend>{words.legend("what")}</legend>
          <form.AppField name="topic">
            {(field) => <field.Select options={["sales", "support"]} />}
          </form.AppField>
          <form.AppField name="message">{(field) => <field.Text />}</form.AppField>
          <form.AppField name="consent">{(field) => <field.Checkbox />}</form.AppField>
        </fieldset>
        <form.Submit>{translate("contact.send", { defaultValue: "Send" })}</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}
