---
adr: 0040
title: Stamp data-recipe outside a production build only
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0004
---

# ADR-0040: Stamp data-recipe outside a production build only

## Status

Proposed

## Context

ADR-0017 marks a bound component with `data-recipe`, and the testing kit is the only reader. A
production page carries the attribute on every bound element for no reader at all. The single-theme
example draws seven bound elements, and every one of them carried it.

The foundation writes the attribute at run time, in `createRecipeContext` through the factory's
`dataAttr` option and in `createSlotRecipeContext` through the provider's default props, so no build
step can strip it from a bundle. What a build step does replace is `process.env.NODE_ENV`. Vite
replaces it in every module it bundles, dependencies included, through the bundler's `define`
(`vite:define`, `option.transform.define`), and in every module it serves in development through
`vite:client-inject`. The rendering library reads the same value for its own development checks.

## Decision

We will stamp `data-recipe` only where `process.env.NODE_ENV` is not `production`, read when a
recipe is bound.

- The foundation reads `process.env.NODE_ENV` as a property, because the development replacement
  matches the text of the read.
- The read happens at bind time rather than once at module load, so a specification sets the
  environment before it binds.
- The type of `NODE_ENV` on `ProcessEnv` is declared in the foundation, because the node types leave
  it to the index signature and the house forbids property access through one.

Measured on the single-theme example with the foundation packed: the production preview draws seven
bound elements and no `data-recipe` attribute, the dev server draws seven of each, and the
production bundle carries no `process.env.NODE_ENV` read.

## Alternatives Considered

### Strip the attribute in a plugin transform

Have the theme plugin rewrite the generated factory so that `dataAttr` is ignored in a production
build.

**Why not:** the slot provider's stamp is written by the foundation and not by the factory, so the
transform would cover one of the two writers. A read the bundler already replaces covers both.

### Read `import.meta.env.PROD`

Gate on the bundler's own environment object.

**Why not:** it names one bundler. `process.env.NODE_ENV` is what every bundler replaces and what
the rendering library reads, so a package that ships it works under any of them.

## Consequences

**Positive:**

- A production page carries no attribute nothing reads.

**Negative:**

- A selector on `data-recipe` in a test that runs against a production build finds nothing. The kit
  runs against a test runner, where the attribute stays.
- The foundation names `process`, and the declaration of `NODE_ENV` ships in its types.

**Neutral:**

- The production bundle keeps the factory's own `data-recipe` branch as dead code, because the
  factory is generated and the option is a run-time value it reads.
