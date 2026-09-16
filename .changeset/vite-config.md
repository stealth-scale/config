---
"@stealthscale/vite-config": minor
---

vite-config: excuse a barrel from the dependency cap

- `lint.barrelled(files)` turns off `import/max-dependencies` for the globs it is handed.
- Every lint tier applies it to `**/index.ts`.
