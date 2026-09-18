---
"@stealthscale/vite-config-specimen": minor
---

add the specimen config package

- `layers(options)` adds the index plugin and every specimen as an entry the dependency scan walks
  before a server starts serving.
- `workspace(files)` relaxes four rules on `**/*.specimen.tsx` from the workspace root, where the
  linter reads its configuration.
- `indexed` and `crawled` are published separately for a repository that states one without the
  other.

21 tests, 100% on all four metrics.
