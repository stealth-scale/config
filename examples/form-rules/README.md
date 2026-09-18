# @stealthscale/example-form-rules

`@stealthscale/example-form-rules` renders a signup form whose rules come from four places, and
shows where each kind of rule belongs.

| The rule                                   | Where it is written                                                                          | Who runs it                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| A VAT number has a shape                   | A `Format` registered in `createEngine`, named as `format: "vat-number"` in the schema       | The engine, for every form on the page |
| The confirmation equals the password       | A `Keyword` registered in `createEngine`, written as `"x-matches": "password"` in the schema | The engine                             |
| A business states a VAT number             | `if`, `then` in the schema                                                                   | The engine                             |
| The username is not taken                  | `onBlurAsync` on the field, debounced, with the library's signal                             | The form library                       |
| The password does not contain the username | A form validator in the `onSubmit` slot, marking `password`                                  | The form library                       |

## Run it

```bash
pnpm --filter @stealthscale/example-form-rules dev
pnpm --filter @stealthscale/example-form-rules test
```

The development server answers on port 4910. `vp test` renders the page into a happy-dom document
and drives each rule: a bad VAT number, a confirmation that differs, a taken name after a blur, a
password holding the name, and a form that passes.

## The engine

`src/engine.ts` builds one engine with `vatNumber` and `matches` and hands it to `FormProvider`.
Every `standardOf` and `defaultsOf` under the provider reads that engine from `useFormEnvironment`,
so a schema naming the format validates the same way in every form.

A refusal from a registered keyword reads its words under the keyword's name, so
`signup.errors.confirm.x-matches` is the entry for the confirmation.

## The field drawn on a condition

The schema requires `vat` only where `kind` is `business`. The page reads `kind` from the form's
store with the library's `useStore`, resolves the schema against it with `engine.resolve`, and draws
the VAT field where the resolved `required` names it. Validation needs none of that: the whole
schema is in the dynamic slot, and the engine evaluates the conditional against the whole value.

## The rule that asks a server

`src/accounts.ts` stands in for the service. The field's `onBlurAsync` awaits it with the `signal`
the library hands over, which the library aborts when the value changes again, and
`onBlurAsyncDebounceMs` waits for typing to stop. The library does not run the request while the
schema refuses the field: after a submit, a username shorter than three characters is refused by the
schema and the service is never asked.
