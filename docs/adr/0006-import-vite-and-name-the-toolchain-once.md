---
adr: 0006
title: Import vite in every package and name the toolchain in one place
status: Accepted
date: 2026-09-16
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0006: Import vite in every package and name the toolchain in one place

## Status

Accepted

## Context

- Every package under `packages/` composes, packs or tests a Vite config.
- On 2026-09-16 the kernel, the block package and both plugins imported `vite-plus`. They imported
  `mergeConfig`, `loadEnv`, `defineConfig`, the default resolve conditions and the `UserConfig`
  type. Four packages peered on `vite-plus`.
- `vite-plus` is a toolchain built over Vite. It depends on `vite` and on `vitest` at exact
  versions. In this workspace `vite` resolves to `@voidzero-dev/vite-plus-core`.
- `vite` exports everything the packages imported from `vite-plus`. The one exception is the type
  augmentation. That augmentation adds `pack`, `lint`, `fmt`, `run`, `staged` and `test` to
  `UserConfig`, and it lives in the `vite-plus` type declarations.
- A package that imports `vite-plus` runs under that toolchain and no other. Replacing the toolchain
  would mean rewriting every import in every package.
- Specifications imported the test runner through `vite-plus/test`. That module re-exports `vitest`.

## Decision

We import `vite` in every package and `vitest` in every specification. No package imports
`vite-plus`. No package peers on `vite-plus`.

- A package peers on `vite`. A package whose specifications import the runner peers on `vitest`.
  Both peers come from the peer catalog. The published range is then a real range and not the exact
  version the workspace pins.
- The shared tsconfig tells the compiler which toolchain is in use. `base.json` in
  `@stealthscale/vite-config-typescript` names `vite-plus` in `types`. That entry loads the
  toolchain's augmentation of `UserConfig`.
- The toolchain is named in two places: that `types` entry, and the `vp` scripts in each manifest.
- The conformance suite reports a peer on `vite-plus` as a violation.

## Alternatives Considered

### Keep importing the toolchain

Every export a package needs is on `vite-plus`. The augmented `UserConfig` arrives with the import,
and nothing has to be typed by hand.

**Why not:** every package is then written against one toolchain. Replacing it means rewriting every
import in every package. Until that rewrite, only `vp` can test or pack a package.

### Load the toolchain's types per package

Each package that writes a toolchain field adds a `.d.ts` file with a reference to `vite-plus`. The
shared tsconfig does not mention a toolchain.

**Why not:** the packer drops a triple-slash reference from the bundled declarations. We measured
this on 2026-09-16 with `vp pack`. A consumer of the published types then sees a `UserConfig`
without `pack` or `test`, and a config written against those fields does not compile. A `types`
entry in the shared tsconfig is loaded in every consumer's compile.

### Declare the toolchain fields in the block package

`@stealthscale/vite-config` publishes its own augmentation of `UserConfig` with the six fields.

**Why not:** the fields belong to the toolchain. A copy drifts from the original on the next
toolchain release. The package would also claim fields it does not own.

## Consequences

**Positive:**

- Replacing the toolchain is a change to one tsconfig line and to the scripts in each manifest. No
  import changes.
- A consumer sees a peer on `vite` and on `vitest`. Those are the tools the package works with.

**Negative:**

- The toolchain's types reference node's types, and node's globals are visible to the compiler in a
  browser package. The `types` split in the shared tsconfig governs `lib` and what each environment
  adds. It does not keep node out.
- A repository that extends the shared tsconfig has to install `vite-plus`. Every stealth repository
  already does.

**Neutral:**

- `vite-plus` stays a development dependency of every package. `vp` runs the scripts.
