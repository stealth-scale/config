---
adr: 0026
title: Bind Zag's machines directly
status: Accepted
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0026: Bind Zag's machines directly

## Status

Accepted

## Context

Five components this library owes a consumer hold state that a person drives: a collapsible, a menu,
a popover, tabs and a tooltip. Each needs focus moved on a key, a layer dismissed from outside it, a
box positioned against a trigger, and ARIA attributes held in step across several elements.

The component form reserved Ark for that case, on the grounds that Ark's parts carry `asChild`, so a
trigger wrapping a button of ours honours it without the button knowing. Ark is a shell over Zag. At
5.39.2 it declares 69 dependencies, 68 of them `@zag-js/*` and the last a date library. Across the
component packages we are porting from, 280 Ark imports name its element factory and 81 its anatomy
builder against 137 that name a machine, and this repository replaced the factory and the anatomy
already.

Zag composes by merging props rather than cloning a child, so the case `asChild` was held for is
covered without the prop. Its state attributes match conditions the compiler already ships, so a
recipe styles a machine's state with nothing added to the foundation.

## Decision

We will bind Zag's machines directly, each named in the package that draws it, because Ark's only
additions over Zag are an element factory and an anatomy builder this repository has replaced.

## Alternatives Considered

### Ark UI, as the component form reserved it

Bind Ark's components where a machine is needed. Ark is proven, and its components arrive with the
machine already wired to an element.

**Why not:** two thirds of the Ark imports in what we are porting name the factory or the anatomy,
both of which we replaced. What is left is a machine Ark takes from Zag and we can take from the
same place.

### A foundation package wrapping Zag

Put the adapter and every machine behind one package of ours, the way the router foundation puts
TanStack Router behind one.

**Why not:** the router foundation adds five hundred lines over its library. A machines package
would re-export and nothing else, carrying a subpath per machine to declare, test and document. Its
one argument was pinning the versions together, which the catalog does for nine packages already.

## Consequences

**Positive:**

- A component package names only the machines it draws, as a dependency at `catalog:`, so the set
  moves at one version. The machines share a core, and a core at two versions breaks them.
- Merging a machine's props into a button of ours is visible at the call site rather than inside a
  clone.

**Negative:**

- No `asChild` on a machine's parts. A caller putting a component of ours inside a trigger merges
  the props themselves or uses `as`.
- We write the wiring Ark did for us, per part and per component.
- A component package gains runtime dependencies, which none had before.

**Neutral:**

- A machine's parts carry `data-part` and `data-scope`. Those are Zag's attributes, not ours.
