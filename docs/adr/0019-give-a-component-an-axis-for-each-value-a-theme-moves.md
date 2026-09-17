---
adr: 0019
title: Give a component an axis for each thing the vocabulary lets a theme move on it
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0019: Give a component an axis for each thing the vocabulary lets a theme move on it

## Status

Accepted

## Context

A component styles itself through its recipe alone. It calls no `css()`, takes no style prop, and
writes no `cva`. A caller who wants a paragraph set small, muted, or truncated has one way to ask
for it: a prop the recipe offers as an axis. A component with no axis for its size has no size a
caller can pick.

The vocabulary is wide. The foundation publishes text style roles for `display`, `heading`, `label`,
`body`, `code` and `caption`, a foreground role for the default ink, the muted, the subtle, the
inverted, and one per status, the layer styles under `fill`, `outline` and `text`, fourteen
animation styles, the semantic `gap`, `inset`, `control` and `icon` scales, nine font weights and
six letter spacings. The helpers `lookVariants`, `controlSizes`, `iconSizes` and `statusVariants`
write the common axes as roles.

Two things we want pull against each other. We want a component to reach a caller with every value a
theme can move on it, so that no caller writes a style. We also want a recipe to stay short enough
to read, and every axis value is a rule in every application's stylesheet.

## Decision

We will give a component an axis for each thing the vocabulary lets a theme move on it, with the
values written as roles through a helper where one exists, because a value a caller cannot reach as
a prop is a value the caller writes as a style.

Three parts follow from that:

- A paragraph takes `size` from the body roles, `tone` from the foreground roles, `weight` from the
  font weights, `align`, and `truncate`. A heading takes `size` from the heading roles, `tone`,
  `effect` from the text layer styles, and `truncate`. A control takes `variant` from the looks,
  `size` from the control scale and `status` from the statuses.
- A heading's size axis names the heading roles and not the steps of the type scale. A heading
  states how loud it is, and which level it is stays with the element.
- A value the helpers do not cover is written as a role by hand, and a value no role carries is
  added to the foundation rather than written in the recipe.

## Alternatives Considered

### A style prop for what the recipe leaves out

Give a component the axes its author needed and let a caller write `textStyle="sm"` for the rest. A
one-off style costs one line.

**Why not:** a style prop needs the compiler in the browser, and a value written at the call site is
a value no theme moves. Both are the constraints the theming design set, and the first measured at
86 KB of bundle.

### Fewer axes, with a wrapper per case

Give a paragraph a `size` axis and nothing more, and let an application write a `MutedText` wrapper
that binds the same recipe with a compound for the muted ink.

**Why not:** the wrapper is a component the application maintains for a value the foundation already
names, and every application writes its own. An axis on the paragraph is written once.

## Consequences

**Positive:**

- A caller reaches every value a theme can move through a prop, and writes no style.
- A theme that moves a role moves it on every component, because the axes read roles.

**Negative:**

- Every axis value is a rule in the sheet. A paragraph with five axes and 20 values adds 20 rules to
  an application's stylesheet whether or not a page uses them.
- A recipe with five axes is longer than one with two, and its specification lists every value.
- An axis added to a component is a change to its public surface and to its README.

**Neutral:**

- The recipe check already reports a value that names no role, so an axis written by hand is held to
  the same rule as one a helper writes.
