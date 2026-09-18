---
adr: 0039
title: Count a dependency's declaration as the component's own
status: Proposed
date: 2026-09-18
supersedes: 0037
superseded-by: none
rfc: 0008
---

# ADR-0039: Count a dependency's declaration as the component's own

## Status

Proposed

## Context

ADR-0037 keeps a property when a recipe file or the component's own package declares it, and drops
the rest. It was measured on the button, which declares every option itself.

A component built over a state machine does not. `components/disclosure/src/menu/machine.ts`
declares `MenuOptions` as `Partial<menu.Props>`, and `root.tsx` builds `RootProps` on it.
`@zag-js/menu` declares `open`, `onOpenChange`, `positioning` and `closeOnSelect`.
`@zag-js/dismissable` declares the dismiss handlers, `onEscapeKeyDown` among them. The menu package
depends on it and the component package never names it.

Measured through the reader on a menu specimen under TypeScript 7.0.2, `RootProps` resolves to 1351
properties. Under ADR-0037 it keeps five: four variants and `aria-label`. The 27 options a caller
sets on a menu are counted under `dropped.foreign` beside the style props.

## Decision

We will count a declaration in a package the component's package depends on at run time as the
component's own, and classify the property as an option.

- The dependencies are walked from the component's manifest through `dependencies` alone, the
  transitive ones included, with the same walk the theme plugin orders presets by. A peer is not
  walked, so the rendering library's attributes and the foundation's style props stay foreign.
- The walk yields package directories, and a declaration's package directory comes from the
  compiler's metadata for the file. Node and the compiler both resolve a link through its real path,
  so a workspace package and an installed one compare the same way and no name is read out of a
  manifest.
- A file the compiler places in no package, its own libraries among them, belongs to nothing and is
  dropped.

The menu root now keeps 31 properties: four variants, and 27 options from the machine and the
packages the machine depends on.

## Alternatives Considered

### Name the machine packages in a table

Keep ADR-0037's rule and add a table mapping a declaration path pattern to a kind, `@zag-js` to
`behaviour`, the way the reader this one was ported from did.

**Why not:** the table names a library the repository may replace, and a second library means a
second row nobody adds until a page comes out empty. The dependency walk reads the same fact off the
manifest that already declares it.

### Keep the machine options in a kind of their own

Classify a dependency's declaration as `behaviour` rather than `option`, so a table draws the
machine's options under a heading of their own.

**Why not:** a caller sets `open` the way they set `label`, and which package declared it is not a
fact the caller acts on. A third kind is a third table on every page for a distinction the reader
does not need.

### Read the direct dependencies only

Walk one level of `dependencies` and stop.

**Why not:** `onEscapeKeyDown` and the other dismiss handlers are declared by a package the machine
depends on and the component never names. One level keeps the machine's own options and drops the
handlers, which a caller sets on a menu as often as `open`.

## Consequences

**Positive:**

- A component built over a machine documents the options a caller sets, with the machine's own doc
  comments and defaults.
- No pattern in the repository names a machine package, and a machine replaced under a component
  reaches its page through the manifest alone.

**Negative:**

- A property a component inherits from a peer of ours is still dropped, because a peer is not
  walked.
- The dependency walk reads every manifest on the component package's runtime graph once per page
  read.

**Neutral:**

- `dropped.foreign` counts the properties declared outside the package, its dependencies and a
  recipe, so the arithmetic a page shows changes for a component with a machine and for nothing
  else.
