---
adr: 0010
title: Generate the styling runtime in one package
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0010: Generate the styling runtime in one package

## Status

Accepted

## Context

The compiler generates a styling runtime from a configuration. That runtime holds the `css`
function, the `styled` factory, the recipe types and the token types. The setup the compiler
documents has every consuming package generate its own.

Two things we want pull against each other. We want each package to be self-contained, which
generating in place gives. We also want one bundle to hold one runtime, and we want a recipe in a
component package to be type-checked against the vocabulary the application compiles. Every
generated copy comes from the same preset, so copies are identical in content and separate in
identity.

The runtime also holds four decisions at once. It fixes the character between an axis and its value
in a class name, the condition list, the token types a recipe is checked against, and the naming
scheme the classes are rewritten into. Each copy is a place those four can disagree.

## Decision

We will generate the styling runtime in `@stealthscale/theme` alone, because one bundle then holds
one runtime and the four decisions inside it are made once.

The arrangement has four parts:

- `theme.runtime()` runs in that package and nowhere else, writing under `generated/`, which this
  repository ignores for formatting and coverage.
- Every other package imports `@stealthscale/theme` for `css`, `cx`, `styled` and the bindings, and
  `@stealthscale/theme/authoring` for the calls a recipe and a theme are written with.
- The package publishes its preset under `./theme`, which is the subpath the build plugin collects
  from every package on an application's dependency graph.
- A component package installs `theme.layers()` for the types and the lint rules. No plugin runs in
  a component package.

`Preset` is declared as an interface of its own rather than re-exported. The declaration bundler
erases a re-exported alias and inlines what it points at, which wrote the compiler's whole preset
type into the declaration of every consuming package: 11,677 lines for one default export,
against 11.

## Alternatives Considered

### Generate in every package that draws

Run the generator in each component package, which is the setup the compiler documents. Each package
is then self-contained and needs no dependency on a foundation to type-check.

**Why not:** every copy comes from the same preset, so a bundle drawing from two component packages
carries two identical runtimes. It also puts the separator, the conditions and the naming scheme in
as many places as there are packages, with nothing holding them equal.

### Publish the runtime as a package of its own

Split the generated output into `@stealthscale/theme-runtime`, which the foundation and the
components both import. The foundation then holds the vocabulary and nothing generated.

**Why not:** the runtime is generated from the foundation's preset, so the two have to be released
together whatever the package boundary says. The split adds a package and a release step and removes
nothing.

### Hand-write the runtime

Write `css`, `styled` and the types against the vocabulary by hand, and drop the generator.

**Why not:** the token types are derived from the preset and change whenever a token does. Written
by hand they drift without anything reporting it, which is the failure the generator exists to
prevent.

## Consequences

**Positive:**

- One bundle holds one runtime, whatever draws into it.
- The separator, the condition list and the naming scheme are decided in one place.
- A recipe in a component package is checked against the vocabulary its application compiles.

**Negative:**

- `@stealthscale/theme` is a dependency of every package that draws, so its version bounds theirs.
- The generated directory has to exist before a consuming package type-checks, so the bootstrap
  order decides whether a clean checkout compiles at all.
- The foundation and the build plugin need each other for a first green run. The plugin's
  specifications use a scratch workspace with a stub system package to break the cycle.
- A package that wants a vocabulary of its own cannot have one without leaving this arrangement.

**Neutral:**

- Two of the compiler's documented setup steps do not apply here, so an author following upstream
  material configures a generator this repository does not run.
