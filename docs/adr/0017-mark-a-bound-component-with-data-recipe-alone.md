---
adr: 0017
title: Mark a bound component with data-recipe alone
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0017: Mark a bound component with data-recipe alone

## Status

Accepted

## Context

The factory writes `data-recipe` on the element that takes the variants when the binding passes
`dataAttr: true`, which the foundation's `createRecipeContext` does. For a component with parts, the
foundation stamps `data-recipe` on the part that takes the variants, and the compiler's slot binding
writes `data-slot` on every part, at two places in its generated file.

Only the testing kit reads either attribute. No stylesheet rule selects on them and no runtime code
reads them. The example application's page carries 24 `data-recipe` and 16 `data-slot` attributes in
a 10.4 kB body.

Every part carries its slot class, `list__item`, which names the recipe and the slot. The pruning
drops a part's variant classes where the value does not style the part, and leaves the slot class.
`data-slot` repeats what that class says.

`data-recipe` does not repeat a class. For a component with parts it marks which part carries the
variants, and the part is whichever slot the author bound with `withProvider`. The classes do not
say that.

## Decision

We will mark a bound component with `data-recipe` alone and drop `data-slot` in the runtime rewrite,
because the slot class already names the recipe and the slot and the attribute repeats it.

Two parts follow from that:

- The runtime rewrite drops the attribute from the generated slot binding, in the file the plugin
  already rewrites for the class names.
- The testing kit's `slotElement` and `slotClasses` find a part by its slot class, and take the
  recipe's name beside the slot's to build it.

## Alternatives Considered

### Keep `data-slot`

Leave the attribute the compiler writes, as a hook for a consumer's own selectors, in the way Ark's
`data-part` is used.

**Why not:** the slot class is the hook, and it is a tested contract. The attribute repeats it at
about 20 bytes per part, and the only reader is the kit.

## Consequences

**Positive:**

- The HTML says each thing once. A part's recipe and slot are read off one class.
- A page with many parts is smaller by one attribute per part.

**Negative:**

- The runtime rewrite edits a third generated file, anchored on a line the compiler emits at
  `2.0.0-beta.17`. A compiler release that moves the line fails the build until the anchor is
  updated.
- `slotElement` and `slotClasses` take a third argument, and every specification that calls them
  changes. In this repository that is 16 call sites.

**Neutral:**

- `recipeElement` and `recipeClasses` keep their signatures.
- A part an Ark anatomy stamps still carries `data-part`, and the kit still reads it.
