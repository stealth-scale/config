# @stealthscale/provider-form

`@stealthscale/provider-form` is the foundation every form in the design system is built on. A JSON
Schema document is the source of the form. Three things come from that document:

- The default values and the message identifiers are derived from it.
- It validates as the Standard Schema the form library runs.
- How the form is drawn is stated beside it as data, or in the schema's own `x-form` keyword.

A component package binds its components with one call, and an application builds a form from a
schema with one hook.

This package draws no element and validates nothing by itself. Every rule beyond the schema is one
of the library's own field or form validators, and every element comes from the component package.

## Install

```bash
pnpm add @stealthscale/provider-form
```

The package peers on `@stealthscale/settings`, `@tanstack/react-form` and `react`.

## Usage

A component package binds its field components, its form components, its layouts and its renderers
once:

```ts
import { createSchemaForm } from "@stealthscale/provider-form";

export const { useAppForm, useSchemaForm, withFieldGroup, withForm } = createSchemaForm({
  fieldComponents: { Checkbox, Number, Select, Text },
  formComponents: { Form, Submit },
  layouts: { Cell, Errors, Group, Item, Step },
  renderers,
});
```

An application builds a form from a schema and draws it:

```tsx
const form = useSchemaForm<Invoice>({ onSubmit: ({ value }) => save(value), schema: invoice });

return (
  <form.AppForm>
    <form.Form>
      <form.Fields />
      <form.Submit />
    </form.Form>
  </form.AppForm>
);
```

The hook starts from the schema's defaults, puts the schema in the form's dynamic slot, and moves
focus to the first refused field on a submit. Where no field holds the error, focus moves to the
region `form.Fields` draws the form's own errors in. `form.Fields` draws the members the
presentation states, or every field where it states none, or the steps with the controls between
them. Every other option is the library's own: `validators` for a rule across fields, `listeners`,
`onSubmitMeta`, and `fieldOptions` for a rule on one field by its path, typed over the field's
value.

```ts
const form = useSchemaForm<Signup>({
  fieldOptions: { username: { validators: { onBlurAsync: taken, onBlurAsyncDebounceMs: 300 } } },
  schema: signup,
  validators: { onSubmit: apart },
});
```

A form written by hand draws `form.AppField` itself and `<form.Fields of={["vat"]} />` for a field
on a condition.

Keep the form across a refresh, and start an edit form from a record:

```ts
const form = useSchemaForm<Profile>({
  draft: { app: "docs", id: `profile.${record.id}` },
  onSubmit: ({ value }) => save(value),
  schema: profile,
  values: record,
});
```

Wrap the application once. A form below it reads the engine, the renderers and the translator from
it, and each is an override on the form that needs one. The translator is i18next's `t`, passed
through unchanged, or `translateFrom` over a map of words.

```tsx
const engine = createEngine({ formats: [vatNumber] });

<FormProvider engine={engine} renderers={[amount]} translate={t}>
  <Routes />
</FormProvider>;
```

A field component reads the schema of its property through `useProperty` and every word through
`useWords`, so a select draws the choices the schema lists and a label reads the catalogue, then the
schema's `title`, then the path.

## What is where

- `createSchemaForm` binds a component package's components and returns `useSchemaForm` beside the
  library's own `useAppForm`, `withForm` and `withFieldGroup`.
- `schemaFormOptions` builds the options a part drawn with `withForm` shares with the hook.
- `schemaOf`, `defaultsOf` and `standardOf` derive what a form needs from a schema.
- `createEngine` builds the engine that evaluates every schema on the page, with the formats and
  keywords a product registers once.
- `Presentation`, `Group`, `Step` and `Field` type how a form is drawn, and `presentationOf` reads
  the same from a schema's own keywords. `Layouts` types the components that lay it out.
- `identifiers` derives every message identifier a form reads, `catalogue` lists them, and
  `useWords` resolves them through the translator in scope.
- `useFieldAria` resolves a field's label, help text and error with the props that tie the three to
  the control. `RootErrors` draws the region the errors of a form as a whole are read from.
- `FormProvider` puts the engine, the renderers and the translator in scope.
- `useDraft` keeps a form's values and step across a refresh. `leaveStep` validates a step before a
  person leaves it.
- `fieldContext`, `formContext`, `useFieldContext` and `useFormContext` are the contexts a component
  package binds its fields and forms to.
