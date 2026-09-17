---
"@stealthscale/vite-config": minor
---

vite-config: refuse an import of the toolchain

- `no-restricted-imports` reports `vite-plus` and every `vite-plus/*` subpath in the style rules,
  with the ADR-0006 message to import `vite` or `vitest` instead.
