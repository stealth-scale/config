/**
 * Binds the field components, the form components, the layouts and the renderers to the form
 * foundation, which is the one call every form example shares.
 */

import { createSchemaForm } from "@stealthscale/provider-form";

import { CheckboxField } from "#checkbox.tsx";
import { Form } from "#form.tsx";
import { layouts } from "#layouts.ts";
import { NumberField } from "#number.tsx";
import { renderers } from "#renderers.ts";
import { SelectField } from "#select.tsx";
import { Submit } from "#submit.tsx";
import { TextField } from "#text.tsx";

/**
 * The two hooks a form is built with, and the two helpers that compose a form or a group of
 * fields outside the component that builds the form.
 *
 * @remarks
 *   `useAppForm` builds a form from the library's own options, and `useSchemaForm` builds one
 *   from a schema. Either form's `AppField` hands each field component the field it draws, and
 *   either form carries `Form`, `Submit` and `Fields`. The contexts are the foundation's, so a
 *   field drawn by another package bound to the same contexts reads the same form.
 */
export const { useAppForm, useSchemaForm, withFieldGroup, withForm } = createSchemaForm({
  fieldComponents: {
    Checkbox: CheckboxField,
    Number: NumberField,
    Select: SelectField,
    Text: TextField,
  },
  formComponents: { Form, Submit },
  layouts,
  renderers,
});
