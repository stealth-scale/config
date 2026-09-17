---
adr: 0011
title: Scope every theme under data-theme and list the default first
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0011: Scope every theme under data-theme and list the default first

## Status

Accepted

## Context

The compiler emits a switchable theme's tokens under `[data-panda-theme=<name>]`, and it emits the
theme an application was built with under `:where(:root,:host)` and nowhere else. No attribute
selects that one, so a subtree sitting inside another theme has no way back to it. We measured this
in a compiled stylesheet of 211,015 bytes.

The attribute name is written into the compiler's native binary three times. No option renames it,
so shipping the compiler's output unchanged makes the compiler a published interface of ours, read
by pages outside this repository. The compiler is at `2.0.0-beta.17`.

A page has to switch a theme and a colour mode on any element, and switching back to the default is
one of those switches. Nothing a page reads should name the compiler. The compiler's own output
satisfies neither requirement, so both pull against shipping it unchanged.

## Decision

We will scope every theme under `data-theme` and compile the first theme an application lists both
unscoped and scoped, because a subtree can then wear any theme including the default, and no page
reads the compiler's name.

The arrangement has four parts:

- `THEME_ATTRIBUTE` is `data-theme` and `COLOR_MODE_ATTRIBUTE` is `data-color-mode`. The two axes
  are independent, and either attribute sits on the document root or on any element for a subtree.
- The build plugin registers a `cssgen:done` host hook, which is the compiler's documented seam for
  editing its output, and rewrites the attribute in the compiled stylesheet. A specification asserts
  the compiler's name is absent from the output.
- An application states `themes: [first, ...rest]`. Every theme compiles under its own attribute,
  and the first also compiles unscoped as the default.
- The colour mode conditions follow the operating system preference where a page states no
  attribute, and the attribute where it does. The preference half is anchored to the document root,
  because the compiler replaces the nesting selector with a theme's own selector and the default
  theme has none.

## Alternatives Considered

### Ship the compiler's attribute

Emit `data-panda-theme` as the compiler writes it, document the name, and skip the hook and its
specification. No rewrite step exists, so nothing can break it.

**Why not:** the attribute is written by a provider this repository publishes and read by pages
outside it, which makes a beta compiler's naming a published interface of ours. The rewrite costs
one host hook and one assertion.

### Scope the non-default themes only

Keep the compiler's own arrangement, where the built theme is unscoped and the others carry
attributes. It is one fewer copy of the default theme's tokens in the stylesheet.

**Why not:** a subtree inside another theme then has no selector that returns it to the default,
which is the gap we measured. The extra copy is the price of a page being able to switch back.

### Carry the colour mode on a class

Write the colour mode as a `.dark` class, which is what the compiler's conditions expect by default
and what most systems built on it do.

**Why not:** the theme is an attribute, so a class for the mode makes the two axes read differently
in markup and in a selector. An attribute also carries a value, so a page states `light` explicitly
rather than by the absence of a class.

## Consequences

**Positive:**

- A subtree wears any theme the application lists, the default included.
- Nothing in a page's markup or in the stylesheet names the compiler.
- The theme and the colour mode compose on one element or on either side of it, in either order.

**Negative:**

- The default theme's tokens appear twice in the stylesheet, once unscoped and once under its
  attribute.
- The stylesheet passes through a rewrite step, so a compiler release that changes its output format
  can break the hook.
- Anchoring the preference half to the document root is a selector nobody would write by hand, and
  its reason is not visible at the point of use.

**Neutral:**

- The rewrite happens at the compiler's own documented seam rather than through a string replacement
  over the finished file.
