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

- `vite-config` contained the kernel and the blocks. The kernel supplies the four kinds of layer,
  the function that produces each kind, and the three passes that turn a list of layers into a
  config. The blocks supply one entry point per part of a Vite+ configuration, from `build` to
  `worker`.
- A package that only produces layers needs the kernel and none of the blocks. `vite-config-css` is
  such a package. It states what a stylesheet is checked by. It uses `contribute` and `preset` to
  state it. It does not set a Vite key of its own.
- With the kernel inside `vite-config`, a repository that installed the stylelint configuration
  installed every Vite block to reach two functions.

## Decision

We publish the kernel as `@stealthscale/vite-config-core`. A package that produces layers depends on
how layers compose, not on what any one block configures.

The kernel does not set a key of a Vite+ configuration and does not know what a block is. The one
exception is reading the repository around a config. Every block would otherwise work out the
directory, the manifest, and the environment for itself. The kernel works them out once.

## Alternatives Considered

### Leave the kernel in `vite-config`

One published package, with every configuration package taking it as a peer dependency. There is one
version number, nothing to keep in step, and the barrel a repository already imports from is the
barrel that produces layers.

**Why not:** the cost to a consumer. `vite-config-css` uses two functions and would declare a peer
dependency on every block in the toolchain to get them. A repository that checks its stylesheets
would install all those blocks and call none of them.

### Give each configuration package its own producing functions

Each package declares its own `preset`, `contribute`, `remove` and `override`. There is no shared
dependency and nothing to keep in step.

**Why not:** the brand. A layer contains a symbol that only its own module can produce. That symbol
stops a bare object literal from passing as a layer. A second copy of that module produces a second
symbol. A layer produced by one copy is not a layer to the other. The composer drops it without a
report.

## Consequences

**Positive:**

- `vite-config-css` depends on the kernel alone. A consumer that installs it gets nothing it does
  not call.
- A configuration package for another framework starts from the kernel without inheriting a position
  on Vite blocks.

**Negative:**

- The kernel and the block package have to be versioned and released together. A kernel change that
  breaks a block breaks it across a package boundary. Nothing type-checks the pair until both are
  built.
- The `vite-config` barrel re-exports the kernel. The same symbol is importable under two package
  names, and two files in one repository can disagree about which name to use.

**Neutral:**

- `vite-config-react` still takes `vite-config` as a peer, because it composes the toolchain's tiers
  and does not only produce layers. The split separates packages by what they need, not by what they
  are.
