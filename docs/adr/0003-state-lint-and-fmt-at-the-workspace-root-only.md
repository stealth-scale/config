---
adr: 0003
title: State lint and fmt at the workspace root only
status: Accepted
date: 2026-09-11
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0003: State lint and fmt at the workspace root only

## Status

Accepted

## Context

Most blocks are read where the tool using them starts. The test runner starts once per package and
takes its root from the package it started in, a build acts on the one application it was pointed
at, and both therefore read that package's own config.

A package that states a `lint` or `fmt` layer of its own states it where nothing looks, because both
tools run from the root of the workspace and read only the root's config. The layer still composes
and merges exactly as any other does, and no error reports it as unread. What the contributor sees
is a rule they believe they relaxed and a linter that goes on firing.

## Decision

We will state the `lint` and `fmt` blocks only in the workspace root's config, and express a
package's own answer as the glob that selects its files, because a package's second config is one
the linter and the formatter never open.

## Alternatives Considered

### Let each package state its own lint and fmt

A package that needs a rule relaxed relaxes it in its own `vite.config.ts`, beside the code the
relaxation is for. Every other block already works this way, so there is no rule to remember and the
exception disappears.

It lost because the tools do not read it. The contributor gets no report that their `lint` block was
skipped, so their next move is to argue with a rule they believe they already turned off.

## Consequences

**Positive:**

- One file says what the whole workspace is checked by, so a reader chasing a rule has one config to
  open.
- Both blocks take globs at every entry point, so the API shows the decision instead of leaving it a
  convention somebody has to be told.

**Negative:**

- A relaxation sits far from the code it excuses. The root config names paths inside packages, and a
  file renamed without its glob loses the relaxation without anything saying so.
- The root config grows with every package-specific exception, and it is the file everyone touching
  the workspace has to read.

**Neutral:**

- The rule is a property of the tools rather than of this design. A linter that read a package's
  config would not need the decision.
