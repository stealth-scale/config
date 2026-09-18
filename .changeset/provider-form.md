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
- Follow a form's description through `useDescribed` and `useDescribedForm`, so a translator, a
  presentation, a field option, an engine or a schema the hook is given after the first render is
  drawn by `Fields` and by every bound field, even where nothing above them re-renders.
- Listen to a draft's store once per form rather than once per render, and leave the draft's own
  writes unread, so writing the form's values to the store does not draw the form again.
- Open a stepped form on the draft's step when the draft arrives after the first render, which is
  when a page rendered on a server reads it.
- Withhold the add control once a repeat group has its `maxItems` items and the remove controls
  while it has no more than its `minItems`. `ItemProps.onRemove` is optional.
- Move focus to a refused field inside the element carrying the form's `formId` where the form
  component writes it as its `id`, and anywhere on the page otherwise.
- Keep a schema's hash and a library object's converted document by the object, so a form reads one
  document and hashes a schema once.
