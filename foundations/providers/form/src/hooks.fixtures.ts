import {
  Cell,
  CheckboxField,
  Errors,
  Form,
  Group,
  Item,
  JumpingStep,
  NumberField,
  SelectField,
  Step,
  Submit,
  TextField,
} from "#components.fixtures.tsx";
import { createSchemaForm } from "#create-schema-form.ts";
import { RANK, type Renderer } from "#renderer.ts";

export const renderers: readonly Renderer[] = [
  { draw: TextField, suits: (_, schema) => (schema["type"] === "string" ? RANK.type : undefined) },
  {
    draw: NumberField,
    suits: (_, schema) =>
      schema["type"] === "number" || schema["type"] === "integer" ? RANK.type : undefined,
  },
  {
    draw: CheckboxField,
    suits: (_, schema) => (schema["type"] === "boolean" ? RANK.type : undefined),
  },
  {
    draw: SelectField,
    suits: (_, schema) => (Array.isArray(schema["enum"]) ? RANK.constraint : undefined),
  },
];

export const layouts = { Cell, Errors, Group, Item, Step };

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

export const { useSchemaForm: useJumpingForm } = createSchemaForm({
  fieldComponents: {},
  formComponents: { Form, Submit },
  layouts: { ...layouts, Step: JumpingStep },
  renderers,
});
