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

- Most blocks are read where the tool that uses them starts. The test runner starts once per package
  and takes its root from the package it started in. A build acts on the one application it was
  pointed at. Both read that package's own config.
- The linter and the formatter run from the root of the workspace and read only the root's config. A
  package that states a `lint` or `fmt` layer in its own config states it where neither tool looks.
- The layer still composes and merges like any other, and no error reports it as unread. The
  contributor sees a rule they believe they relaxed and a linter that keeps reporting it.

## Decision

We state the `lint` and `fmt` blocks only in the workspace root's config. A package expresses its
own answer as the glob that selects its files. The linter and the formatter never open a package's
own config.

## Alternatives Considered

### Let each package state its own lint and fmt

A package that needs a rule relaxed relaxes it in its own `vite.config.ts`, beside the code the
relaxation is for. Every other block already works this way. There is no rule to remember and no
exception.

**Why not:** the tools do not read it. The contributor does not learn that their `lint` block was
skipped. Their next step is to argue with a rule they believe they already turned off.

## Consequences

**Positive:**

- One file states what the whole workspace is checked by. A reader who is tracing a rule has one
  config to open.
- Both blocks take globs at every entry point. The API shows the decision instead of leaving it as a
  convention somebody has to be told.

**Negative:**

- A relaxation sits far from the code it excuses. The root config names paths inside packages. A
  file that is renamed without its glob loses the relaxation, and nothing reports it.
- The root config grows with every package-specific exception. It is the file everyone who touches
  the workspace has to read.

**Neutral:**

- The rule is a property of the tools, not of this design. A linter that read a package's config
  would not need this decision.
