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

## The form

`src/checkout-form.tsx` builds the form with `useSchemaForm` and draws it with `form.Fields`. The
foundation walks the members and draws a group as a fieldset or a layout. A repeat group is drawn
once per item, with the library's `pushFieldValue` and `removeFieldValue` behind the buttons, and
`lines[].amount` is bound to `lines[0].amount` for the first item. The foundation subscribes to the
resolved schema by its hash. A keystroke re-renders the field that received it and no other member.

## The schema

`src/schema.ts` writes the presentation beside the data.

- `x-form` at the root states the identifier and the members: a `who` fieldset, a `billing` fieldset
  with a three-column grid inside it, a `line` fieldset with `repeat: "lines"`, and the lone `notes`
  field.
- `x-control` on `notes` names the renderer. `x-span` on `billing.city` takes two of the three
  columns. `x-options` on `lines[].amount` hands the renderer a currency.
- `vat` exists only under the condition that `kind` is `business`. It is listed in the `who`
  fieldset. The fields skip it while the resolved schema lacks it. When it appears, the field starts
  from the property's own default, because the values built from the schema never had it.
- No member names `reference`. `unplaced` reports it, and the page lists it.

`presentationOf` reads all that into a `Presentation`. `validatePresentation` checks every member
against the paths the engine lists, so a typo throws before the page renders. `catalogue` lists
every identifier the form reads with the schema's own English. The page draws that list as a table.

## The renderers

`@stealthscale/example-form-fields` registers a text box for a string, a number box for a number, a
checkbox for a boolean and a select for an `enum`. `src/renderers.ts` adds two the page needs: a
number with a currency in its options, at the rank of a constraint, and a multi-line box a field
names by `control`, at the highest rank. `FormProvider` puts them after the library's own, and
`rendererFor` picks the highest rank, and the later registration on a tie.

A renderer is a field component. It reads its field through the contexts, as every component of
`@stealthscale/example-form-fields` does, and it is handed the field's presentation, whether the
resolved schema requires it, and the property's schema.
