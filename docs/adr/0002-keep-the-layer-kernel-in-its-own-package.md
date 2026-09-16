---
adr: 0002
title: Keep the layer kernel in its own package
status: Accepted
date: 2026-09-11
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0002: Keep the layer kernel in its own package

## Status

Accepted

## Context

- `vite-config` held two things a configuration needs. The kernel supplies the four kinds of layer,
  the function that produces each kind, and the three passes that turn a list of layers into a
  config. The blocks supply one entry point per part of a Vite+ configuration, from `build` to
  `worker`.
- A package that only produces layers needs the kernel and none of the blocks. `vite-config-css` is
  such a package. It states what a stylesheet is checked by, uses `contribute` and `preset` to state
  it, and names no Vite key of its own.
- With the kernel inside `vite-config`, a repository that installed the stylelint configuration
  installed every Vite block in order to reach two functions.

## Decision

We publish the kernel as `@stealthscale/vite-config-core`. A package that produces layers depends on
how layers compose, not on what any one block configures.

Nothing in the kernel names a key of a Vite+ configuration or knows what a block is. The one
exception is reading the repository around a config. The directory, the manifest and the environment
are what every block would otherwise work out for itself, so the kernel works them out once.

## Alternatives Considered

### Leave the kernel in `vite-config`

One published package, with every configuration package taking it as a peer dependency. There is one
version number, nothing to keep in step, and the barrel a repository already imports from is the
barrel that produces layers.

**Why not:** the cost to a consumer. `vite-config-css` uses two functions and would declare a peer
dependency on every block in the toolchain to get them. A repository that wants its stylesheets
checked would install all of those blocks and call none of them.

### Give each configuration package its own producing functions

Each package declares its own `preset`, `contribute`, `remove` and `override`. There is no shared
dependency and nothing to keep in step.

**Why not:** the brand. A layer holds a symbol that only its own module can produce. That symbol is
what stops a bare object literal from being mistaken for a layer. Two copies of that module produce
two symbols. A layer produced by one copy is not a layer to the other, and the composer drops it
without a report.

## Consequences

**Positive:**

- `vite-config-css` depends on the kernel alone. A consumer that installs it gets nothing it does
  not call.
- A configuration package for another framework starts from the kernel without inheriting a position
  on Vite blocks.

**Negative:**

- Two packages have to be versioned and released together. A kernel change that breaks a block
  breaks it across a package boundary, and nothing type-checks the pair until both are built.
- The `vite-config` barrel re-exports the kernel. The same symbol is importable under two package
  names, and two files in one repository can disagree about which name to use.

**Neutral:**

- `vite-config-react` still takes `vite-config` as a peer, because it composes the toolchain's tiers
  and does not only produce layers. The split separates packages by what they need, not by what they
  are.
