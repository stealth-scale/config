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

`config-vite` held two things a configuration needs. The kernel supplies four kinds of layer, the
function that produces each kind, and the three passes that turn a list of them into a config. The
blocks supply one entry point per part of a Vite+ configuration, from `build` through `worker`.

A package that only mints layers needs the kernel and none of the blocks. `config-css` is one of
those. It states what a stylesheet is checked by, reaching for `contribute` and `preset` to state it
and naming no Vite key of its own. With the kernel inside `config-vite`, a repository installing a
stylelint configuration pulled in every Vite block to get at two functions.

## Decision

We will publish the kernel as `@stealthscale/config-core`, because a package that mints layers
should depend on how layers compose rather than on what any one block configures.

Nothing in the kernel names a key of a Vite+ configuration or knows what a block is. Reading the
repository around a config is the one exception: the directory, the manifest and the environment are
what every block would otherwise work out for itself.

## Alternatives Considered

### Leave the kernel in `config-vite`

One published package, with every configuration package taking it as a peer dependency. There is one
version number, nothing to keep in step, and the barrel a repository already imports from is the
barrel that mints layers.

It lost on what it costs a consumer. `config-css` reaches for two functions and would declare a peer
dependency on every block in the toolchain to get them, which a repository that wants its
stylesheets checked pays for and never calls.

### Give each configuration package its own minting functions

Each package declares its own `preset`, `contribute`, `remove` and `override`, with no shared
dependency and nothing to keep in step.

It lost on the brand. A layer holds a symbol only its own module can produce, which is what stops a
bare object literal being mistaken for a layer however closely it resembles one. Two copies of that
module produce two symbols, so a layer minted by one is not a layer to the other and the composer
drops it without saying so.

## Consequences

**Positive:**

- `config-css` depends on the kernel alone, and a consumer installing it gets nothing it does not
  call.
- A configuration package for another framework starts from the kernel without inheriting a position
  on Vite blocks.

**Negative:**

- Two packages have to be versioned and released together, and a kernel change that breaks a block
  breaks it across a package boundary where nothing type-checks the pair until both are built.
- The barrel re-exports the kernel, so the same symbol is importable under two package names and two
  files in one repository can disagree about which to use.

**Neutral:**

- `config-react` still takes `config-vite` as a peer, because it composes the toolchain's tiers
  rather than only minting layers. The split separates packages by what they need, not by what they
  are.
