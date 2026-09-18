# @stealthscale/provider-form

`@stealthscale/provider-form` is the foundation every form in the design system is built on. A JSON
Schema document is the source. The default values and the message identifiers are derived from it,
it validates as the Standard Schema the form library runs, and how it is drawn is stated beside it
as data. The package publishes the one set of contexts a bound field and a bound form share, the
engine that evaluates a schema, the provider that puts the engine, the renderers and the translator
in scope, and the draft that keeps a form across a refresh.

The components that draw a form are in `@stealthscale/forms`. This package draws nothing and adds no
validation of its own: every rule beyond the schema is one of the library's own field or form
validators.

## Install

```bash
pnpm add @stealthscale/provider-form
```

The package peers on `@stealthscale/settings`, `@tanstack/react-form` and `react`.

## Usage

Wrap the application once. A form below it reads the engine, the renderers and the translator from
it, and each is an override on the form that needs one. The translator is i18next's `t`, handed in
as it is.

```tsx
import { createEngine, FormProvider } from "@stealthscale/provider-form";

const engine = createEngine({ formats: [vatNumber] });

export function App() {
  const { t } = useTranslation("forms");

  return (
    <FormProvider engine={engine} translate={t}>
      <Routes />
    </FormProvider>
  );
}
```

Hand the schema to the form library as a Standard Schema, in the slot a form validates in:

```ts
import { defaultsOf, formDefaults, standardOf } from "@stealthscale/provider-form";

const form = useAppForm({
  ...formDefaults,
  defaultValues: defaultsOf<Signup>(schema),
  validators: { onDynamic: standardOf<Signup>(schema) },
});
```

Keep a form across a refresh:

```ts
import { useDraft } from "@stealthscale/provider-form";

const draft = useDraft<Signup>({ app: "docs", id: "signup", schema });
const form = useAppForm({
  defaultValues: defaultsOf<Signup>(schema, draft.restored?.values),
  listeners: {
    onChange: ({ formApi }) => draft.write(formApi.state.values),
    onChangeDebounceMs: 300,
  },
});
```

## What is where

- `schemaOf`, `defaultsOf` and `standardOf` derive what a form needs from a schema.
- `createEngine` builds the engine that evaluates every schema on the page, with the formats and
  keywords a product registers once.
- `Presentation`, `Group`, `Step` and `Field` type how a form is drawn, and `presentationOf` reads
  the same from a schema's own keywords.
- `identifiers` derives every message identifier a form reads, and `catalogue` lists them.
- `FormProvider` puts the engine, the renderers and the translator in scope.
- `useDraft` keeps a form's values and step across a refresh.
- `fieldContext`, `formContext`, `useFieldContext` and `useFormContext` are the contexts a component
  package binds its fields and forms to with `createFormHook`.
