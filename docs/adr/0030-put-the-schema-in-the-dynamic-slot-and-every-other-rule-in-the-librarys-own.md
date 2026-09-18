---
adr: 0030
title: Put the schema in the dynamic slot and every other rule in the library's own
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0030: Put the schema in the dynamic slot and every other rule in the library's own

## Status

Proposed

## Context

TanStack Form 1.33.5 validates with one function or one Standard Schema per slot. `FormValidators`
states nine validators and three debounces. A field validator has its own slots, its own debounce
per asynchronous slot, `onChangeListenTo` and `onBlurListenTo`, and an `AbortSignal`. A form
validator returns `{ form, fields }`, and the library writes each field's entry onto that field.

`standardSchemaValidators.validate` calls a Standard Schema on the whole value, groups the issues by
path and stores the issue objects as they are, so an issue keeps any member its producer gave it.

`revalidateLogic` delegates to the default logic and appends the dynamic slot, against its own doc
comment. Measured: a change before any submit runs `onChange`, a submit runs `onChange`, `onBlur`,
`onSubmit` and `onDynamic`, and a change after a submit runs `onChange` and `onDynamic`.

## Decision

We will wrap a schema as a Standard Schema with `standardOf` and put it in the form's `onDynamic`
slot, and we will write every rule the schema cannot state as the library's own validator in the
slot it names, because the library already maps issues to fields, debounces per slot, listens to
other fields and aborts a superseded request.

An issue keeps `keyword` and `values` beside `message` and `path`, so the frame reads a message
identifier from the field's errors and nothing of ours runs between the schema and the field.
`formDefaults` states `revalidateLogic()`, so the schema validates on submit and then on every
change.

## Alternatives Considered

### Rule types of our own

`Check` on a field with `at` and `debounce`, `Across` over several fields, composed into slots by a
`validatorsOf` factory.

**Why not:** a Standard Schema receives the value alone, so `at` cannot be read from inside one, and
the library debounces per slot, so `debounce` per check has no counterpart. Each rule type was a
second copy of a library member.

### A field validator for every rule, distributed by the form

Bind a form-level rule to the fields it marks when `Fields` draws them, through `onChangeListenTo`.

**Why not:** a generated form has no way to choose which of two fields a cross-field rule belongs
to, and a rule marking two fields would be written twice. A form validator states the rule once and
the library puts each entry on its field.

## Consequences

**Positive:**

- A rule on a field reads the data layer by closing over it, so the foundation depends on none of
  it.
- A refused schema stops a field's asynchronous validators, in `FieldApi.js` lines 466 to 495, so a
  request never goes out on a value the schema already rejected.
- A form that wants the schema live from the first keystroke states
  `validationLogic: revalidateLogic({ mode: "change" })`, a form option.

**Negative:**

- A validator at `onBlur` that refused stays on screen until the next blur, through every keystroke.
  A rule whose answer should follow the typing goes in the dynamic slot as well.
- A rule marking one field is written at the form rather than on the field, and a person reading the
  field does not see it there.

**Neutral:**

- One slot holds one function. A caller who wants two rules in one slot writes one function that
  calls both.
