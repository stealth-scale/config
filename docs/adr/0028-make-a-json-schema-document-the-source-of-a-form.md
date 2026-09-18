---
adr: 0028
title: Make a JSON Schema document the source of a form
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0028: Make a JSON Schema document the source of a form

## Status

Proposed

## Context

A form here comes from four places: a schema we wrote, a supergraph input type, an OpenAPI body, and
a plugin manifest. The last three arrive as JSON Schema documents. Nothing behind them produces a
zod object.

zod 4.6.5 converts itself to a JSON Schema document through
`~standard.jsonSchema.input({ target: "draft-2020-12" })`, measured. The Standard Schema
specification publishes no list of the libraries that implement that interface.

A schema supplies the values a form starts from, the validator it runs and the message identifiers
it reads. A schema that is the source supplies all three once.

## Decision

We will make a JSON Schema document the source of every form, because three of the four places a
form comes from produce nothing else, and everything a form needs derives from the document.
`schemaOf` reads a document through and converts a library object through its own converter.
`defaultsOf`, `standardOf`, `presentationOf` and `identifiers` derive the rest.

The draft is 2020-12. It is what zod emits and what the engine assumes where `$schema` is absent.

## Alternatives Considered

### A zod object as the source

Make a zod object the form's source and read JSON Schema out of it for drawing.

**Why not:** it works in one direction only. A document arriving from a supergraph, a service or a
manifest has no zod object behind it and never will. A zod object still fits this decision, through
`schemaOf`, and a zod object with a `transform` goes into one validator slot as it is.

### A type of our own for a form's shape

State a form's fields in a type this design system defines, and generate a schema from it.

**Why not:** a document nobody here wrote would have to be converted into that type first, and the
conversion would lose whatever keyword the type has no member for. JSON Schema is the format the
documents already arrive in.

## Consequences

**Positive:**

- The same schema validates in the form and on a server, with the same engine and the same issues,
  so a form and its backend never disagree about a field.
- A form generated from a supergraph or a manifest needs no code beside the document.
- A catalogue is generated from the schema rather than gathered from rendered forms.

**Negative:**

- A generated form has no static type. Its values are `Record<string, unknown>`.
- JSON Schema composes by narrowing. A form that needs a looser rule than its base schema states
  needs a different schema rather than an option.
- What zod expresses and JSON Schema has no keyword for, a `transform`, is lost in the conversion.

**Neutral:**

- Whether valibot or arktype implement the conversion was not checked. A caller finds out by asking
  the object for the property.
