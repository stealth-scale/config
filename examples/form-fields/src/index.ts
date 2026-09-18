/**
 * Publishes a small set of field components bound to the form foundation's contexts, the hook
 * that builds a form with them, and the words every component reads through the translator in
 * scope. The form examples share it, and it is the shape a component package for forms takes.
 *
 * @packageDocumentation
 */

export { CheckboxField, type CheckboxFieldProps } from "#checkbox.tsx";
export { type FieldLike, type FieldState, useBoundField } from "#field-like.ts";
export { Form, type FormProps } from "#form.tsx";
export { type ControlAttributes, Frame, type FrameProps } from "#frame.tsx";
export { useAppForm, withFieldGroup, withForm } from "#hook.ts";
export { FormNameContext, useFormName } from "#name.ts";
export { NumberField, type NumberFieldProps } from "#number.tsx";
export { SelectField, type SelectFieldProps } from "#select.tsx";
export { Submit, type SubmitProps } from "#submit.tsx";
export { TextField, type TextFieldProps } from "#text.tsx";
export { useWords, type Words, wordsOf } from "#words.ts";
