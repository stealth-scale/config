# @stealthscale/example-form-fields

`@stealthscale/example-form-fields` binds four field components and two form components to the
contexts of `@stealthscale/provider-form` with the form library's own `createFormHook`. The form
examples share the `useAppForm` it answers, and a component package for forms takes the same shape:
a frame that draws the label, the help text and the error once, controls that draw nothing but
themselves, and every word read through the translator in scope.

## Run it

```bash
pnpm --filter @stealthscale/example-form-fields test
pnpm --filter @stealthscale/example-form-fields build
```

`vp test` runs one specification per file. Each renders a component under a form built with
`useAppForm`, types into it, and reads the words and the attributes back out of a happy-dom
document.

## What is where

- `hook.ts` calls `createFormHook` with the foundation's `fieldContext` and `formContext`, the four
  field components under `Checkbox`, `Number`, `Select` and `Text`, and `Form` and `Submit` as the
  form components. `useAppForm`, `withForm` and `withFieldGroup` come back from it.
- `frame.tsx` draws what every control shares. It writes `htmlFor` on the label, `aria-describedby`,
  `aria-invalid` and `name` on the control, and shows the first error once a person has touched the
  field or a submit was attempted.
- `words.ts` resolves every word through the translator in scope. A label is read under
  `<id>.fields.<path>.label` with the schema's title or the path written out as the default. An
  error with a keyword is read under `<id>.errors.<path>.<keyword>` and then `errors.<keyword>`,
  with the engine's message as the default and the issue's values available to the message.
- `name.ts` carries the form's identifier, `<id>` in every identifier above. A page sets it once
  around a form with `FormNameContext`.
- `field-like.ts` types the four members a component reads of its field, because the library's
  context answers a field whose members are untyped.
