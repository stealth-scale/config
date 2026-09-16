# @stealthscale/vite-config-plain

The configuration a package is packed under when it cannot extend a tier.

The tiers in `@stealthscale/vite-config` are built on `@stealthscale/vite-config-core` and pack
through `@stealthscale/vite-plugin-sbom`, which is built on `@stealthscale/vite-plugin-base`. Those
three packages are packed before any tier exists, so each of them states this configuration instead
of a tier.

Peers on `vite`.

```bash
pnpm add -D @stealthscale/vite-config-plain
```

## Usage

```ts
import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
```

`plain` is the node tier's `pack`, `resolve`, `ssr` and `test` blocks, written out. A specification
in this package holds each block to what the tier composes, so a change to the tier fails here until
it is made in both places.

## What it states

| Block            | States                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `pack`           | One entry at `src/index.ts`, declarations, attw and publint, and source published under `stealth-source`   |
| `resolve`, `ssr` | `stealth-source` ahead of the default conditions, so a specification reads a sibling package as its source |
| `test`           | Specifications by glob, mocks cleared and restored, an assertion required in every test, a shuffled order  |

## Exports

| Export  | Kind         |
| ------- | ------------ |
| `plain` | `UserConfig` |
