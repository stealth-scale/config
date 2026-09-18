# @stealthscale/example-form-draft

`@stealthscale/example-form-draft` renders a profile form in two steps. The form starts from the
record saved in the database, keeps a draft in the browser as a person types, opens on the step and
the values of that draft after a refresh, and never writes the password to it.

## Run it

```bash
pnpm --filter @stealthscale/example-form-draft dev
pnpm --filter @stealthscale/example-form-draft test
```

The development server answers on port 4920. Type into the form, refresh the page, and the form
opens where you left it. `vp test` renders the page over a memory store, plants a draft, reads the
step and the values back, advances the debounce, and reads what the store holds.

## The record and the draft

`src/records.ts` stands in for the database. The form is handed the saved profile, and the draft is
keyed by the record's identifier, `profile.p-1`, so a draft of one profile never opens over another.

```ts
const draft = useDraft<ProfileValues>({ app: "docs", id: `profile.${record.id}`, schema: profile });
const form = useAppForm({
  defaultValues: defaultsOf<ProfileValues>(profile, draft.restored?.values ?? saved),
  listeners: {
    onChange: ({ formApi }) => draft.write(formApi.state.values),
    onChangeDebounceMs: 300,
  },
});
```

The draft's values win over the record where there is a draft, because they are the person's unsaved
edits. Both are written over the schema's defaults by `defaultsOf`, which fills in the password the
draft left out, so every control starts controlled. A record that changes on the server while a
draft is open is not detected here. An application that needs that puts the record's version into
the draft's identifier, and a draft of the old version is then never found.

The library's own change listener writes the draft, debounced by `onChangeDebounceMs`. Leaving a
step writes the step at once through `draft.write(values, step)`, and the form opens on
`draft.restored.step`. A submit saves the record and calls `draft.clear()`.

## The steps

Each step is a component built with the library's own `withForm` over the options `src/options.ts`
states once, so the form and both steps share one type and a step draws `form.AppField` over the
form the page owns.

Leaving the first step marks its fields touched, calls `validateField` once with the cause `submit`,
which runs every form-level validator, and reads the errors of that step's fields alone. A refused
field keeps the person on the step and takes focus. The second step's fields are not touched until
it is reached, so the page shows no error of theirs before then.
