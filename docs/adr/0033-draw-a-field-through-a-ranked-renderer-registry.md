---
adr: 0033
title: Draw a field through a ranked renderer registry
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0033: Draw a field through a ranked renderer registry

## Status

Proposed

## Context

A generated form has to pick a control for every property it draws. A string is a text box, a string
with `format: "email"` an email box, a string with `enum` a select, a number with a currency in its
options an amount box, and a field naming `control: "textarea"` a multi-line box. A component
package ships the first four. An application or a plugin adds the rest.

The library offers nothing here. `FieldApi` has no id and no aria member, so the label, the help
text, the error and the wiring between them are ours.

## Decision

We will draw a field through a registry of renderers, each answering how well it suits a field. The
highest answer draws. `RANK` fixes the four ranks. A type alone is 1, a format 2, a constraint 3,
and a field naming the renderer by `control` 10. Two renderers at one rank are settled by
registration order. The later one draws. A component package gives its renderers to
`createSchemaForm` and an application gives its own to `FormProvider`. The provider's come after the
package's.

A renderer is a field component. It reads its field through the library's context and composes the
package's frame, which draws the label, the help text and the error once and writes `htmlFor`,
`aria-describedby`, `aria-invalid`, `aria-required` and `name`. A checkbox draws its label inside
the control and composes no frame.

## Alternatives Considered

### A control per JSON Schema type, fixed in the foundation

A map from `type` and `format` to a component, written once.

**Why not:** a package cannot add a control the foundation has never heard of, and a plugin cannot
override one for a host. A renderer answering a rank lets a package add a control and a later
registration override a default.

### Each renderer drawing its own label

The renderer receives the resolved words and draws label, control, help text and error itself.

**Why not:** twenty renderers would each wire the ids and the aria attributes, and they would drift.
One frame in the package does it once, and a control that draws its label inside itself opts out.

### The first registration at a rank draws

**Why not:** a package overrides a default by registering after it, which is the order a provider
appends in. Drawing the first would make an override a removal.

## Consequences

**Positive:**

- A package adds a control by registering a renderer, and a plugin's renderers are appended to the
  host's provider on registration.
- Every field is accessible the same way, because one frame writes the wiring.
- `x-control` in a schema names a renderer without the schema knowing which package draws it.

**Negative:**

- A renderer that ships in a package imports the form library, unlike a declaration, which names no
  library. A renderer is a component the host mounts and runs, so the import costs nothing new.
- `options` reaches a renderer unchecked. A renderer parses it as it would a prop from a stranger.

**Neutral:**

- A field no renderer suits is skipped. `Fields` draws nothing for it and moves on.
