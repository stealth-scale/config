# @stealthscale/example-form-fields

`@stealthscale/example-form-fields` binds four field components, two form components, four layouts
and four renderers to `@stealthscale/provider-form` with one call to `createSchemaForm`. The form
examples share the two hooks it returns, and a component package for forms takes the same shape: a
frame that draws the label, the help text and the error once, controls that draw nothing but
themselves, layouts that draw the groups, items and steps of a generated form, and every word read
through the translator in scope.

## Run it

```bash
pnpm --filter @stealthscale/example-form-fields test
pnpm --filter @stealthscale/example-form-fields build
```

`vp test` runs one specification per file. Each renders a component under a form built with
`useAppForm` or `useSchemaForm`, types into it, and reads the words and the attributes back out of a
happy-dom document.

## What is where

- `hook.ts` calls `createSchemaForm` with the four field components under `Checkbox`, `Number`,
  `Select` and `Text`, `Form` and `Submit` as the form components, the layouts and the renderers.
  `useAppForm`, `useSchemaForm`, `withForm` and `withFieldGroup` come back from it. A form built
  with either hook carries `Form`, `Submit` and `Fields`.
- `frame.tsx` draws what every control shares. It writes `htmlFor` on the label, `aria-describedby`,
  `aria-invalid`, `aria-required` and `name` on the control, and shows the first error once a person
  has touched the field or a submit was attempted. The label reads the catalogue, then the words
  given, then the schema's `title`, then the path written out.
- `text.tsx`, `number.tsx`, `select.tsx` and `checkbox.tsx` draw the controls. Each reads the schema
  of its property through `useProperty`, so a text box draws an email or a password box where the
  property's `format` says so, and a select draws the choices the property's `enum` lists.
- `cell.tsx`, `group.tsx`, `item.tsx` and `step.tsx` are the layouts `form.Fields` draws a generated
  form with. The words on their buttons read `<id>.actions.add`, `<id>.actions.remove`,
  `<id>.actions.back`, `<id>.actions.next` and `<id>.actions.submit`.
- `renderers.ts` lists the renderers, one per type and a select for an `enum`. An application adds
  its own through `FormProvider`, after these.
- `field-like.ts` types the four members a component reads of its field, because the library's
  context answers a field whose members are untyped.
