---
adr: 0009
title: Style a component through its config recipe only
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0009: Style a component through its config recipe only

## Status

Accepted

## Context

Two things we want pull against each other. We want a theme to move every value a component draws
with, including its geometry, its motion and its typography. We also want component authors to reach
for whatever the compiler offers, and the compiler offers four places to write a style: a recipe, a
`css()` call, a style prop, and a `cva` call. A style written in any of the last three is a style no
theme can address.

Everything a recipe file imports reaches the browser bundle, because the component that draws with
it imports the recipe. The compiler's pattern helpers are runtime values. One recipe that read a
single helper pulled 86 KB of `@pandacss/preset-base` into a bundle we measured.

The component libraries, the providers and the platform SDK move into this repository from their own
repositories, and none of them has arrived. Setting the constraint now costs nothing. Setting it
afterwards costs one rewrite per component.

## Decision

We will style a component through its config recipe alone, because a theme can move only the values
a recipe states.

The rule has five parts:

- A recipe is written with `defineRecipe` or `defineSlotRecipe` and lives in the component package
  beside the component.
- A component binds that recipe through `createRecipeContext` or `createSlotRecipeContext`, and
  calls no `css()`, takes no style prop, and writes no `cva` or `sva`. The package entry publishes
  neither `cva` nor `sva`.
- A recipe reads semantic tokens, layer styles, text styles, animation styles and scale steps. It
  names no colour, no length in `px`, `rem` or `pt`, and no colour mode.
- A pattern is a typed function from props to a style object, never a runtime value.
- A value a component needs and no token carries is added to the foundation.

`recipeViolations` reports each breach, and every component package asserts that the list is empty.

## Alternatives Considered

### Style props and `css()` in components

Give a component style props and let it call `css()`, which is the interface the compiler documents
and the one Chakra offers. A component author writes a one-off style in one line, and the interface
is familiar to anyone who has used either system.

**Why not:** a style prop needs the compiler in the browser to interpret it, which is the 86 KB we
measured. A `css()` call in a component is a style no theme can address, which is the first thing we
want.

### A component token tier

Give each component a token layer of its own that a theme overrides, and let components write styles
wherever they like as long as the values come from that layer.

**Why not:** it records the same styles twice, once as tokens and once at the point of use, and
nothing stops a component writing a value outside both. A theme that wants a component tier can
still define one.

### Document the rule and check it in review

State the rule in the contributing guide and enforce it when reading a pull request. No kit, no
specification per package.

**Why not:** we read a design system that enforced its contract this way, and eight of its own
contrast pairs sat below the thresholds we set, with review having passed all of them. A check that
runs on every package on every run names the recipe and the value.

## Consequences

**Positive:**

- A theme moves every value a component draws with, because no value sits anywhere else.
- The browser bundle carries no compiler. We measured 86 KB removed.
- Every component's styles read the same way, in one file, across every package.

**Negative:**

- A one-off style costs a token in the foundation, which is a wider change and a wider review than a
  local style would have been.
- A component with a genuinely dynamic value, such as a measured width, has to pass it as a custom
  property rather than as a style.
- Every component package carries a recipe specification it would not otherwise need.
- The compiler's own documentation and most of its examples show an interface this repository
  refuses, so an author following upstream material writes code the gate rejects.

**Neutral:**

- Two of the compiler's exports, `cva` and `sva`, are absent from the package entry for this reason
  alone.
