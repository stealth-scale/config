---
"@stealthscale/provider-form": minor
---

Add the form foundation. It publishes the contexts a bound field and a bound form share, the engine
that evaluates a JSON Schema, and `standardOf`, which wraps a schema as the Standard Schema the form
library validates with. It derives the defaults and the message identifiers from a schema, types how
a form is drawn as data, puts the engine, the renderers and the translator in scope through
`FormProvider`, and keeps a form across a refresh with `useDraft`.

- Add `createSchemaForm`, which binds a package's field components, form components, layouts and
  renderers in one call and returns `useSchemaForm` beside the library's own hooks.
- Add `Fields`, a form component every form carries, which draws a form from its presentation:
  groups, repeat groups with add and remove, steps opened on the draft's step, one step or the
  members given.
- Attach the schema, the presentation, the engine, the translator and the draft to the form, read
  back through `useProperty`, `useWords`, `useResolved` and `descriptionOf`.
- Take the library's own form options beside the schema, and a field's options by presentation path
  in `fieldOptions`, typed over the value at that path.
- Add `schemaFormOptions`, `leaveStep`, `propertyOf`, `requiredIn`, `choicesOf`, `textOf`, `bound`,
  `countAt`, `valueAt`, `interpolate` and the `<id>.actions.<name>` identifier.
- Interpolate `{{name}}` in `translateFrom` and `untranslated`.
- Keep nothing in `useDraft` when it is given no options.
- Type `Path<Values>` as a string, so a typed presentation stands where a string is asked for.
