---
adr: 0007
title: Name a layer for the call that made it
status: Accepted
date: 2026-09-16
supersedes: none
superseded-by: none
rfc: 0001
---

# ADR-0007: Name a layer for the call that made it

## Status

Accepted

## Context

- A removal takes a layer back by name. A consumer has to know the name before they can write the
  removal.
- On 2026-09-16 the five config packages named their layers in three grammars. The React tiers
  composed to `react/react.refresh` and `react/test.environment(happy-dom)`. The stylesheet package
  named its layers after the tool, as `stylelint.check`. Inside the block package,
  `server.port(4200)` carried its argument and `server.reachable` did not.
- Three factories in the block package returned a layer named for a different call.
  `lint.undocumented()` returned a layer named `lint.relax(**/*.spec.ts)`.
- No README stated any of these names. A consumer found a name by composing the config and printing
  it.
- The argument for one grammar is in RFC-0001, with the alternatives and their costs.

## Decision

We name every layer for the call a consumer writes.

- The name is the path to the factory, as a consumer writes it, followed by the arguments that
  distinguish two calls in parentheses. `lint.relax({ files: ["**/*.spec.tsx"] })` returns a layer
  named `lint.relax(**/*.spec.tsx)`. `server.port(4200)` returns `server.port(4200)`.
- An add-on prefixes its names with its own name. `react.lint.rendered()` returns
  `react.lint.rendered`. `css.layers()` returns `css.check`.
- A factory that returns an array composes layers other factories made. Each layer keeps its own
  name inside the same block. `react.layers()` returns `react.plugin.refresh`, `react.test.cleanup`
  and `react.test.document`. `lint.preset.node()` returns `lint.node`.
- A factory that builds its layer from another factory renames it with `named()` from the kernel.
- A departure is a verb and takes one record whose first field is `because`. The array it acts on
  has the same field name in every block: `files` for globs, `deps` for package names, `rules` for a
  rule map, `runs` for code, `patterns` for import patterns.
- The kernel keeps `owned()`. No package in this repository calls it.

## Alternatives Considered

### Document the names and change nothing

Write the composed names into each README and hold new code to them in review.

**Why not:** the READMEs of three packages disagreed with their exports after five days. A rule that
no check enforces is broken by the next package.

### Prefix every layer with its package through `owned()`

Keep `owned("react", …)` and accept `react/react.refresh` as the name.

**Why not:** the prefix doubles the package name, and the part after the slash is still the name of
whatever call the factory delegated to. The consumer still cannot predict it.

### Keep deprecated aliases for one release

Export each old name beside the new one, marked deprecated, and delete the aliases in the next minor
release.

**Why not:** the consumers are the sibling repositories, and each one is rewritten once when it
moves into this monorepo. An alias would live in every published tarball of one release cycle for
nobody's benefit.

## Consequences

**Positive:**

- A consumer predicts a layer name from the call they wrote. A removal is written without composing
  the config first.
- The conformance suite checks the rule on every run. A layer named for another call fails the
  package's own gate.

**Negative:**

- Every layer name in the React package changed. Nine factories and three presets in the block
  package were renamed. The changesets list the old and new names.
- A layer named for its arguments has a long name wherever the argument is an array, and a removal
  quotes the whole array.

**Neutral:**

- The kernel gained one function, `named()`.
