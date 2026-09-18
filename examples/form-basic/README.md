# @stealthscale/example-form-basic

`@stealthscale/example-form-basic` renders a contact form from one JSON Schema document. The
schema's defaults are the values the form starts from, the schema itself is the validator in the
form's dynamic slot, and every word on the page comes from a catalogue in the language a person
picks. The form states no label, no message and no rule of its own.

## Run it

```bash
pnpm --filter @stealthscale/example-form-basic dev
pnpm --filter @stealthscale/example-form-basic test
```

The development server answers on port 4900. `vp test` renders the page into a happy-dom document,
submits the empty form, reads the refusals back in English, switches to Dutch, and submits a filled
form.

## The schema

`src/schema.ts` states five properties. A string a person has to fill in states `minLength: 1`,
because `required` in JSON Schema asks only that the property exist and every control starts from an
empty string. The consent is `const: true`, so an unticked box refuses under the keyword `const`.

## The words

`src/words.ts` keeps one catalogue per language, keyed the way `@stealthscale/provider-form` derives
identifiers. The form's identifier is `contact`, set once around the form with `FormNameContext`, so
a field at `email` reads:

| What                                | Key                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| Its label                           | `contact.fields.email.label`                              |
| Its help text                       | `contact.fields.email.description`                        |
| A refusal under `minLength`         | `contact.errors.email.minLength`, then `errors.minLength` |
| The legend of the fieldset it is in | `contact.groups.who.legend`                               |

A form in another package reads its words under its own identifier, so one catalogue holds every
form of an application without a clash. The English `errors.format` entry has no `contact` twin, so
the email format refusal reads the shared words, which is what a product-wide message is.

`translator(language)` builds a function with i18next's shape: a key or a list of keys, a
`defaultValue`, and the values a message interpolates with `{{name}}`. An application over i18next
hands `FormProvider` its `t` instead, and nothing on the page changes.

## The form

`src/app.tsx` builds the form with `useAppForm` from `@stealthscale/example-form-fields`, spreads
`formDefaults` for the submit-then-live validation and the focus on a refused submit, starts from
`defaultsOf(contact)`, and puts `standardOf(contact)` in the `onDynamic` slot. The form library maps
each issue onto its field, and the field's frame reads the keyword off the issue to find the words.
