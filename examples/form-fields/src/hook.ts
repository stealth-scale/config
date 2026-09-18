/**
 * Binds the field and form components to the foundation's contexts, which is the one call every
 * form example shares.
 */

import { createFormHook, fieldContext, formContext } from "@stealthscale/provider-form";

import { CheckboxField } from "#checkbox.tsx";
import { Form } from "#form.tsx";
import { NumberField } from "#number.tsx";
import { SelectField } from "#select.tsx";
import { Submit } from "#submit.tsx";
import { TextField } from "#text.tsx";

/**
 * The hook a form is built with, and the two helpers that compose a form or a group of fields
 * outside the component that builds the form.
 *
 * @remarks
 *   `useAppForm` answers a form whose `AppField` hands each field component the field it draws,
 *   and whose `Form` and `Submit` read the form. The contexts are the foundation's, so a field
 *   drawn by another package bound to the same contexts reads the same form.
 */
export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldComponents: {
    Checkbox: CheckboxField,
    Number: NumberField,
    Select: SelectField,
    Text: TextField,
  },
  fieldContext,
  formComponents: { Form, Submit },
  formContext,
});
