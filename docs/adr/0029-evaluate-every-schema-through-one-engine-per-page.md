---
adr: 0029
title: Evaluate every schema through one engine per page
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0029: Evaluate every schema through one engine per page

## Status

Proposed

## Context

A form starts from the values its schema states, draws the schema that applies to the values in
hand, reads every issue with a value, and lists the path of every property any branch can produce.
Drawing a conditional form needs the resolved schema on every change.

`json-schema-library` 11.6.2 resolves `if`, `then`, `else` and `allOf` against a value through
`reduceNode` at 0.215 ms per call on a 52-property schema, validates at 0.003 ms, keeps an `x-`
keyword it does not know, and registers formats and keywords through `extendDraft`. AJV 8.20.0
validates at 0.0001 ms, refuses an `x-` keyword in strict mode, and does not resolve a schema
against a value. Runtime code on disk is 892 kB and 580 kB.

Two defects in the library are measured. A format the draft does not register passes every value. An
error code the draft does not register throws `ReferenceError` from inside the library.

## Decision

We will evaluate every schema on a page through one engine, built by `createEngine` over
`json-schema-library` behind an `Engine` interface, because `reduceNode` is needed for drawing
whichever library validates and a second library would buy 0.003 ms per keystroke for 580 kB.

The engine registers an error code beside each `Format`, and `check` refuses a schema that names a
format nobody registered. Every fact about the library's error shapes is kept in the one file that
converts an error to an `Issue`. The provider holds the engine. A format a product registers once
applies to every form under it. A plugin remote reads that engine and imports no schema library of
its own.

## Alternatives Considered

### AJV for validation beside the library for resolving

Validate with AJV's compiled functions and resolve with `reduceNode`.

**Why not:** two libraries on a form page for 0.003 ms per keystroke. AJV also refuses the `x-`
keywords a presentation is written in unless every one is registered or strict mode is off.

### An engine per form

Build an engine where a form is built, with the formats the form needs.

**Why not:** a plugin's form under a host would validate with an engine that has none of the host's
formats registered, and a `format: "vat-number"` in a supergraph type would pass every value there.

## Consequences

**Positive:**

- A format or a keyword is registered once and applies to every schema on the page.
- A typo in a schema's `format` throws where the form is built rather than passing every value
  without a report.
- Swapping the library is a change to one file, because nothing outside it reads a library error.

**Negative:**

- The engine costs 892 kB of runtime code on disk. Nobody has measured the bundle.
- `reduceNode` runs on every change to any value. At 0.215 ms it is affordable, and it is the cost
  that grows with the schema.

**Neutral:**

- A schema written for this engine validates under AJV only with `strictSchema: false` or a keyword
  registered for each `x-` keyword.
