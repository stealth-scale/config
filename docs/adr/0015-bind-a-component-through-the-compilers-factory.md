---
adr: 0015
title: Bind a component through the compiler's factory and change its element with as
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0015: Bind a component through the compiler's factory and change its element with as

## Status

Accepted

## Context

A component binds its recipe through `createRecipeContext` or `createSlotRecipeContext`, and both
wrap the factory the compiler generates. That factory reads two props of its own off every styled
component: `as`, which swaps the element and keeps the recipe, and `unstyled`, which drops the
recipe's classes. It does not read `asChild`.

Ark's element factory adds `asChild`. It wraps an element in 56 lines, clones the one child, and
merges the props into it. A component bound through `ark.p` takes `asChild`, and a package that
binds one element that way peers on `@ark-ui/react`.

Two things we want pull against each other. We want a caller to change the element a component
draws, because a heading's level and a list's numbering are the caller's to decide. We also want a
package that draws text to peer on `react` and the theme and nothing more, because every peer a
consumer installs is a version they have to hold in step.

## Decision

We will bind every element through the compiler's generated factory and let a caller change the
element with `as`, because the factory already generates and types that prop and nothing is added to
the runtime.

Three parts follow from that:

- A package peers on `@ark-ui/react` only where it binds one of Ark's machines. Ark's parts carry
  `asChild` themselves, so a machine part wrapping a component of ours honours it without the
  component knowing.
- `as` takes a tag or a component. `<Heading as="h1">` draws an `h1`, and `<Button as={Link}>` draws
  a router link, each in its recipe.
- `unstyled` is a prop the factory reads and no component offers. A consumer who drops a recipe is a
  consumer no theme reaches.

## Alternatives Considered

### Ark's factory for every element

Bind every element through `ark.p`, `ark.h2` and the rest, so that every component takes `asChild`.
The factory is proven across Ark's own components, and a consumer who knows Ark knows the prop.

**Why not:** it peers every package on `@ark-ui/react` for one prop, and the prop's one case, a
machine part wrapping a component of ours, the machine part already covers. A package that binds a
machine peers on Ark anyway, and gets `asChild` on the machine's parts.

## Consequences

**Positive:**

- A typography package peers on `react` and `@stealthscale/theme` alone.
- `as` is typed by the compiler and needs no runtime of ours.

**Negative:**

- `as` is typed as `ElementType`, so `<Heading as="a" href>` compiles whether or not the heading's
  props include `href`.
- A consumer merging into an element they already built rewrites it with `as`. There is no `asChild`
  on an element component.
- The conformance kit checks `asChild` and not `as`, so an `as` check has to be added before a
  component can assert it.

**Neutral:**

- A package that binds one of Ark's machines still peers on Ark, and its machine parts still take
  `asChild`.
