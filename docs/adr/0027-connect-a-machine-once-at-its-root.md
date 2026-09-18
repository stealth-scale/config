---
adr: 0027
title: Connect a machine once at its root
status: Accepted
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0027: Connect a machine once at its root

## Status

Accepted

## Context

A component is a directory holding a barrel, a recipe, the recipe's binding and one file per element
it draws. Nothing in that layout holds a state machine, because no component written so far has one.

Running a Zag machine takes two calls. `useMachine` starts it and answers a service. The machine's
`connect` turns that service into an api: a getter per part, each answering the props that part
needs, beside the machine's state and methods. Every part needs that api, and both a trigger and its
content need the same running machine or they describe two components to a screen reader.

Zag's own examples put a whole component in one function, so the api is a local variable. This
library puts each part in its own file. The recipe binding carries a recipe's variants down and has
no channel for arbitrary props, which is what a machine's getters answer, so it cannot carry the api
either.

## Decision

We will hold a component's machine in `machine.ts` beside its recipe and connect it once at the
root, because every part needs one api from one running machine.

## Alternatives Considered

### Connect in every part, from a service in context

Let each part call `connect` for itself, which is what Ark does, so a part is independent of what
any other part did.

**Why not:** it settles the same question in every part file. The collapsible, the menu, the
popover, the tabs and the tooltip hold 49 parts between them in the platform we are porting.

### One file for the whole component

Write the root, the trigger and the content in one function, as Zag's examples do, so no context is
needed at all.

**Why not:** it gives up one file per part, which is what makes every component in this library read
the same way.

### A helper that hides the merge

Publish something taking a bound element and a getter, leaving a part at the one line it is
everywhere else.

**Why not:** we have written no such part yet. A helper drawn before the repetition is known is a
helper shaped by a guess.

## Consequences

**Positive:**

- `connect` runs once per render rather than once per part.
- The context and the error a part gets outside its root come from a factory in the hooks
  foundation, so both are written once for every machine component.

**Negative:**

- A part is a function that merges the machine's props into the bound element, so a machine
  component's parts read differently from every other component's.
- A root's props come from the recipe, the machine and the element. The binding types two of the
  three, so each root states its props type by hand.
- A root takes an id, which no component here took before. A caller naming their own passes it
  through the machine, because the machine builds its ARIA references from it.

**Neutral:**

- `machine.ts` is named for the machine the way `context.ts` is named for the binding, which is the
  thing each file deals with rather than a symbol inside it.
