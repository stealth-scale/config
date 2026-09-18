# @stealthscale/example-form-presentation

`@stealthscale/example-form-presentation` renders a checkout form from the presentation its schema
carries. The schema states the data. Its `x-form` keyword states the members in order, in three
fieldsets, one of them a grid and one of them repeated per line of the order. Each field is drawn by
the renderer that suits it best, and a field the schema declares under a condition is drawn only
where the condition holds.

## Run it

```bash
pnpm --filter @stealthscale/example-form-presentation dev
pnpm --filter @stealthscale/example-form-presentation test
```

The development server answers on port 4930. `vp test` renders the page into a happy-dom document,
reads the fieldsets and the controls back, switches the kind to a business, adds and removes a line,
and submits a filled order.

## The schema

`src/schema.ts` writes the presentation beside the data.

- `x-form` at the root states the identifier and the members: a `who` fieldset, a `billing` fieldset
  with a three-column grid inside it, a `line` fieldset with `repeat: "lines"`, and the lone `notes`
  field.
- `x-control` on `email` and `notes` names the renderer. `x-span` on `billing.city` takes two of the
  three columns. `x-options` on `lines[].amount` hands the renderer a currency.
- `vat` exists only under the condition that `kind` is `business`. It is listed in the `who`
  fieldset, and the fields skip it while the resolved schema lacks it. When it appears, the field
  starts from the property's own default, because the values built from the schema never had it.
- `reference` is a property no member names. `unplaced` reports it, and the page lists it.

`presentationOf` reads all of that into a `Presentation`. `validatePresentation` checks every member
against the paths the engine lists, at module load, so a typo throws before the page renders.
`catalogue` lists every identifier the form reads with the schema's own English, and the page draws
that list as a table.

## The renderers

`src/renderers.tsx` registers six renderers with a rank each. A string is a text box at the rank of
a type. An email format is an email box at the rank of a format. An `enum` is a select at the rank
of a constraint, and so is a number with a currency in its options. A field naming a control takes
that renderer at the highest rank. `rendererFor` picks the highest, and the later registration on a
tie.

A renderer is a field component. It reads its field through the contexts, as every component of
`@stealthscale/example-form-fields` does, and it is handed the field's presentation, whether the
resolved schema requires it, and the property's schema.

## The fields

`src/fields.tsx` is the twenty lines the design calls `<Fields>`, written for this one form with the
library's own `withForm`. It walks the members, draws a group as a fieldset or a layout, draws a
repeat group once per item with the library's `pushFieldValue` and `removeFieldValue` behind the
buttons, and binds `lines[].amount` to `lines[0].amount` for the first item. It reads the whole
values from the form's store to count the lines, which re-renders it on every change. The component
package's own fields subscribe to the resolved schema's hash instead.
