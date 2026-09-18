---
adr: 0031
title: State a form's presentation as data keyed by path
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0031: State a form's presentation as data keyed by path

## Status

Proposed

## Context

A form drawn from a schema needs an order, fieldsets, rows, grids, line items and steps, none of
which JSON Schema states. A plugin declares a form in a manifest, which is data a host reads without
running plugin code. A supergraph input type and an OpenAPI body belong to somebody else, so a
presentation written into them is a copy that drifts.

JSON Forms describes drawing as a tree of layouts pointing into the schema with JSON pointers.
react-jsonschema-form annotates a `uiSchema` shaped like the data. Neither groups two fields from
different branches of the data, and the second has nowhere to hold a step.

`json-schema-library` keeps an `x-` keyword it does not know and reports nothing for it, measured.
`reduceNode` resolves `if`, `then`, `else` and `allOf` against a value.

## Decision

We will state a form's presentation as a `Presentation`: a flat object keyed by the path into the
values, with groups holding their members and a group holding a `repeat` path drawn once per item.
It is written in the schema's own keywords, `x-form` at the root and `x-control`, `x-options`,
`x-span`, `x-label`, `x-description` and `x-placeholder` on a property, when the schema is ours, and
beside the schema as an object when it is not. Where both state a field, the form takes the field
the call site states.

A conditional form is a schema question. The presentation lists every field any branch can produce,
and `Fields` skips a member the schema resolved against the values lacks. A member no branch of the
schema can produce is refused when the form is built. A field the schema states and no member draws
is reported.

A presentation carries a direction, a column count, a span and whether a group starts closed, and no
class, style or length. Anything beyond those is a renderer.

## Alternatives Considered

### A tree of layouts, as JSON Forms has

An independent UI tree pointing into the schema with JSON pointers.

**Why not:** a presentation keyed by path does everything the tree was for, including a group whose
fields come from different branches of the data, and it is flat enough to write in a manifest and
merge with a second one. Two trees have no common shape to merge by.

### Annotations shaped like the data

`ui:widget` and `ui:order` hung off each property, mirroring the schema.

**Why not:** two fields from different branches cannot share a fieldset, and there is nowhere to
hold a step.

### A condition grammar of our own

`visibleWhen: { kind: "business" }` on a field, evaluated by the foundation.

**Why not:** a second grammar has to be kept in step with the schema's, and could show a field the
schema forbids or hide one it requires. The schema already states the condition, and the engine
already resolves it.

### A field naming its group and carrying an order

`group: "billing", order: 3` on each field.

**Why not:** the structure is then in as many places as there are fields, and the order of two
fields is two numbers somebody keeps apart. A group holding its members puts the structure in one
place and the order in the list.

## Consequences

**Positive:**

- A plugin's form is data a host draws without running plugin code, and a host can refuse a member
  the schema lacks before drawing anything.
- A schema we own carries its presentation in one document. A schema we do not own is annotated
  beside it and never copied.
- `Presentation` is data, so its shape can only grow, and a manifest written before a member existed
  still reads.

**Negative:**

- `options` is a hole in the styling limit. A renderer reads it as it would a prop from a stranger.
- A `oneOf` nobody has answered yet resolves to nothing, so `resolve` draws the schema with its
  `oneOf` removed until a branch matches. Our own schemas prefer `if`, `then` and `else`.

**Neutral:**

- A document with `x-` keywords validates under AJV only with `strictSchema: false` or a keyword
  registered for each one.
