---
adr: 0016
title: Name a component's files for what they export and publish its directory's barrel
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0016: Name a component's files for what they export and publish its directory's barrel

## Status

Accepted

## Context

A component is a recipe, a binding, one file per element it draws, and whatever publishes them. A
component that draws one element has one component file. A component that draws several parts has
one file per part, and a consumer composes the parts.

Two things we want pull against each other. We want a reader who has read one component's directory
to have read them all, which asks for one layout with no variation. We also want a component with
parts and a component with one element to be written in that same layout, and the two publish
differently: a consumer writes `<Heading>` for the one and `<List.Root>` for the other.

The testing kit reads a recipe file by its name. `recipeFiles` matches `*.recipe.ts` and takes the
preset key off the file name, so `button.recipe.ts` registers as `button`. Nothing else in the
repository reads a component's file by its name.

## Decision

We will write every component as a directory named for it, with each file named for what it exports
and the directory's `index.ts` as the one file the package barrel reads, because the directory
carries the component's name and the barrel decides how the component is published.

The layout is:

```
<name>/
  index.ts              what the directory publishes
  recipe.ts             export const recipe
  context.ts            export const { PropsProvider, withContext } = createRecipeContext(recipe)
  <name>.ts             the component, where it draws one element
  <part>.ts             one file per part, where it draws several
```

Four parts follow from that:

- A file is `.ts` unless it holds JSX, and then it is `.tsx`. A binding holds none.
- The package barrel publishes an element component flat, `export * from "#heading/index.ts"`, and a
  component with parts as a namespace, `export * as List from "#list/index.ts"`. The namespace is
  the one name a component with parts has.
- A part file exports the part's short name, `Root`, and the directory's barrel re-exports it under
  that name.
- `recipeFiles` gains a second form: a file named `recipe.ts` registers under its directory's name.

## Alternatives Considered

### The component's name on every file

Name the files `heading.recipe.ts`, `heading.context.ts` and `list-root.ts`. A file name says which
component it belongs to without the directory, and an editor tab that says `heading.recipe.ts` says
more than one that says `recipe.ts`.

**Why not:** the directory already says it, and the name on the file was the one thing the testing
kit read. A second form in `recipeFiles` reads the directory instead. The editor tab is the cost,
and the editor shows the directory beside it.

### The flat names beside the namespace

Publish `ListRoot` and `List.Root` both, as Ark does. A consumer importing one part writes one
import.

**Why not:** two names for one component doubles the barrel and the barrel's specification, and a
reader has to learn which one a codebase uses. The namespace form is what the compiler's extraction
already reads in the card example, with `jsx: [/^Card(\.\w+)?$/u]`.

## Consequences

**Positive:**

- One layout for every component, whether it draws one element or several.
- The name of a component is written once, on its directory.
- The package barrel reads one file per component and nothing deeper.

**Negative:**

- An editor tab reads `recipe.ts` for every component, and a reader tells them apart by the
  directory.
- A component with three parts is twelve files with its specifications.
- The card example under `examples/lib-surfaces` does not match the layout until it is renamed.

**Neutral:**

- The compiler's extraction reads `<List.Root>` through a `jsx` pattern on the namespace, as it
  already reads `<Card.Root>`.
