---
adr: 0018
title: Put a specification beside every source file, the barrels included
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0018: Put a specification beside every source file, the barrels included

## Status

Accepted

## Context

Every package in this repository keeps one specification per source file, named the same with
`.spec` before the extension, and no specification without a source file of the same name. The
barrels were excused. A barrel is a list of re-exports with no logic to check, and the packages
under `packages/` and `foundations/` hold a conformance specification for the package and none for
its `index.ts`.

A component package has more barrels than any other kind. Every component directory has one, and the
package has one above them. A barrel is where a component leaks its recipe or its binding into the
public surface, and where an export a consumer used is dropped. Neither is caught by the
specification of any other file.

## Decision

We will put a specification beside every source file, the barrels included, because a barrel is the
one place a component's public surface is written and the one place it changes unseen.

A barrel's specification names every export and nothing beside it, as a sorted list, and asserts
that the recipe and the binding are not among them. It is four lines. The conformance suite holds a
package to it where the package asks with `barrels: true`, which every component package does.

## Alternatives Considered

### A specification for every file but the barrels

Hold the rule as it stood, one specification per source file with the barrels excused, because a
barrel has no logic to check.

**Why not:** a barrel has a contract to check. The list of names it exports is what a consumer
imports and what the compiler's extraction reads, and a barrel specification of four lines catches a
leaked recipe, a leaked binding and a dropped export.

## Consequences

**Positive:**

- A component's public surface is asserted, per directory and per package.
- A leaked `recipe` or `withContext` fails a specification rather than reaching a consumer.

**Negative:**

- Every barrel is one more file, and a component with three parts is twelve files with its
  specifications.
- Adding an export to a component means editing its barrel's specification as well as the barrel.

**Neutral:**

- The packages under `packages/` and `foundations/` keep their conformance specifications, which
  already read the package barrel through the library contract, and the suite leaves their barrels
  alone unless they ask.
