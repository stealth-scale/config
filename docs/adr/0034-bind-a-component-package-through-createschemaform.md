---
adr: 0034
title: Bind a component package through createSchemaForm and attach the schema to the form
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0034: Bind a component package through createSchemaForm and attach the schema to the form

## Status

Proposed

## Context

`createFormHook` takes a package's field and form components and returns `useAppForm`, `withForm`
and `withFieldGroup` over them. A foundation that called it at module scope would import the
component package, and the package imports the foundation for the contexts. That is a cycle.

An application binding `createFormHook` itself and building its form over `useAppForm` alone has to
set the form's identifier through a context of its own, pass a select its options although the
schema lists them, write eight lines to leave a step, wire a draft in three places, and write the
walk over the presentation with `withForm`, with a shim for the array operations the library types
as `never`. Every application would write the same code, and every component package would copy it.

Three library facts are measured. `useForm` gives a form component a copy of the form object and a
field the object itself, and both share `baseStore`. The library types the form it gives a form
component over a record with no members, and a form typed over its own values is not assignable to
`AnyFormApi`. A `withForm` part typed with the schema's `onDynamic` slot accepts a form carrying
more validators and refuses one carrying none.

## Decision

We will publish `createSchemaForm`, a factory the component package calls once with its field
components, form components, layouts and renderers. It calls `createFormHook` over the foundation's
contexts with `Fields` added to the form components, and returns `useSchemaForm` beside the
library's own hooks.

`useSchemaForm` derives the defaults, the validator and the presentation from the schema, keeps the
draft, builds the form over the library options the caller gave, and writes a description to a
registry keyed by the form's `baseStore`. `Fields`, `useProperty`, `useWords` and `useResolved` read
that description back, so a select draws the schema's choices and a text box its format without
being told. Nothing forces a hand-written form: the hook's options extend the library's
`FormOptions`, and a field's options go in `fieldOptions` by presentation path, typed over the value
at that path.

## Alternatives Considered

### The binding in the component package

`useSchemaForm` and `Fields` written in `components/forms`, which calls `createFormHook` itself.

**Why not:** every component package would carry the walk, the resolve, the steps and the draft
wiring, and a second package would copy them. The factory takes the components and keeps the
machinery in one place, and the package still makes one call.

### A `Fields` closure returned by the hook

`useSchemaForm` returns `{ form, Fields }` with `Fields` bound to the form.

**Why not:** a component created in a hook needs a stable identity across renders, and it cannot be
used inside a `withForm` part, which receives the form and not the closure. A form component reads
the form from the library's context and works anywhere the form does.

### The schema handed to every component as a prop

`<Fields schema={schema} presentation={presentation} />` and `<field.Select options={…} />`.

**Why not:** the schema is repeated at every call site, and a field component drawn by hand has no
way to reach it. The registry attaches it to the form once.

## Consequences

**Positive:**

- An application writes one hook and one element for a form. An example form is near twenty lines.
- Every library option on a form or a field is reachable from the generated form, and `onSubmit`
  receives the library's own props.
- `form.Fields` sits beside `form.Form` and `form.Submit`, which is the library's own shape.

**Negative:**

- Writing the registry during render is a side effect, idempotent and keyed by the form, in the same
  spirit as the library's own `Object.assign` on the form.
- A typed presentation is not assignable to the untyped one the registry holds. One assertion stands
  at that boundary.
- Typed field options for a path inside more than one repeat group are unmeasured.

**Neutral:**

- `examples/form-fields` is the reference component package until `components/forms` exists.
