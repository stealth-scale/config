---
"@stealthscale/vite-config": minor
---

vite-config: refuse an import of the toolchain

- `no-restricted-imports` reports `vite-plus` and every `vite-plus/*` subpath in the style rules,
  with the ADR-0006 message to import `vite` or `vitest` instead.
- `staged.formatted` runs `vp fmt --no-error-on-unmatched-pattern`, so a commit that stages a file
  the formatter ignores, such as `pnpm-lock.yaml`, is no longer refused.
- Every lint tier excuses `**/src/theme.ts` from `no-default-export` beside `**/*.config.ts`. A
  package publishes its preset under `./theme` through a default export, which the build plugin
  reads, so the file needs no departure of its own.
