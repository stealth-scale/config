---
adr: 0008
title: Check every config package with one conformance spec
status: Accepted
date: 2026-09-16
supersedes: none
superseded-by: none
rfc: 0002
---

# ADR-0008: Check every config package with one conformance spec

## Status

Accepted

## Context

- On 2026-09-16 the gate passed with 832 tests and full coverage. The same tree had two published
  packages without licence text in their tarballs, three README block tables that disagreed with
  their barrels, and one composed tier with layer names in three grammars.
- Each of those is a promise a package makes to the repositories that install it. No unit
  specification reached any of them.
- The same day, the coverage report counted only the files a test had imported. A source file with
  no test was absent from the report, and a package with no specifications reported full coverage of
  nothing.
- The argument for a kit, with the alternatives, is in RFC-0002.

## Decision

We publish `@stealthscale/testing-config`, and every package under `packages/` adds one
specification that asserts an empty list of violations.

- `violations({ at, kind, module })` reads the package and returns each part of the contract it
  breaks. Each violation is one sentence prefixed with the check that found it.
- A `library` is checked on its manifest. A `plugin` is checked on its manifest and its plugin
  factory. A `config` package is checked on its manifest, its barrel, its README block table, the
  layers each factory returns and the tiers it publishes.
- A factory with required parameters is given them through `arguments`. A tier is given through
  `tiers`. A missing entry in either is a violation.
- `skip` turns a check off with a reason. `only` narrows a run and is reported as a violation when
  `CI` is set.
- The kit is a development dependency of the workspace root. A package's specification resolves it
  through the root, so no package depends on the kit and no cycle exists.
- Coverage names every source file under `src`. An entry point is left out: `main.ts`, `main.tsx`, a
  file under `bin`, and a worker file.

## Alternatives Considered

### A function that writes the test cases

Material UI's `describeConformance` calls `describe` and `it` itself from one call.

**Why not:** the kits in this repository assert nothing. A specification is one assertion, and a
failure names the breach. `@stealthscale/testing-react` already returns a list of violations, and
this kit returns one in the same way.

### Lint rules for package authors

Oxlint plugin rules that check that a factory's layer is named after the factory and that its record
has `because` first.

**Why not:** a rule sees one file. It cannot compose a tier to find two layers with one name. It
cannot read a tarball's file list or compare a README to a barrel.

### One specification at the root that scans every package

A root-level project that reads every package and runs every check in one place.

**Why not:** the root runs its tests under the node environment. Composing a rendering package's
layers needs that package's own configuration. The `arguments` table also belongs beside the
package, where the person who adds a factory edits it.

## Consequences

**Positive:**

- A package that drifts from the contract fails its own gate. The failure message states what
  drifted.
- An untested source file lowers the coverage number instead of vanishing from it.

**Negative:**

- One new package, packed on every bootstrap.
- Eleven specifications, one per package. The block package's carries an `arguments` table with 36
  entries, and the table has to change when a factory's signature changes.
- `readme.exports` parses Markdown. A README whose block table changes heading or layout passes the
  check. The check does not find the table and passes the package unread.

**Neutral:**

- The suite reported three layers named for another call on its first run. Those were fixed the same
  day.
