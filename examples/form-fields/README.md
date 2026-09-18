# @stealthscale/example-form-fields

`@stealthscale/example-form-fields` binds four field components, two form components, five layouts
and four renderers to `@stealthscale/provider-form` with one call to `createSchemaForm`. The form
examples share the two hooks it returns. A component package for forms takes the same shape:

- A frame that draws the label, the help text and the error once.
- Controls that draw nothing but themselves.
- Layouts that draw the groups, items and steps of a generated form.
- Every word read through the translator in scope.

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
- `frame.tsx` draws what every control shares. `useFieldAria` resolves the label, the help text, the
  first error and the attributes that tie the three to the control, and the frame spreads them onto
  the elements it draws. The error is shown once a person has touched the field or a submit was
  attempted. `aria-describedby` names the help text and the error only while each is on the page.
  The label reads the catalogue, then the words given, then the schema's `title`, then the path
  written out.
- `text.tsx`, `number.tsx`, `select.tsx` and `checkbox.tsx` draw the controls. Each reads the schema
  of its property through `useProperty`, so a text box draws an email or a password box where the
  property's `format` says so, and a select draws the choices the property's `enum` lists.
- `cell.tsx`, `errors.tsx`, `group.tsx`, `item.tsx` and `step.tsx` are the layouts `form.Fields`
  draws a generated form with. Every layout but the cell writes the id the foundation gives it on
  its root element, which is how focus moves into a step, into an item, and into the region the
  form's own errors are read from. The words on their buttons read `<id>.actions.add`,
  `<id>.actions.remove`, `<id>.actions.back`, `<id>.actions.next` and `<id>.actions.submit`.
- `renderers.ts` lists the renderers, one per type and a select for an `enum`. An application adds
  its own through `FormProvider`, after these.
- `field-like.ts` types the four members a component reads of its field, because the library's
  context returns a field whose members are untyped.
