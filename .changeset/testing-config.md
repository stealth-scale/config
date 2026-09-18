---
"@stealthscale/testing-config": minor
---

exclude a specimen from the source checks

- `.specimen.tsx` joins the suffixes a file carries when it is not itself a source, beside
  `.spec.tsx` and `.fixtures.tsx`.
- `source.specs` no longer asks a specimen for a specification beside it.
- `source.declared` no longer reports what a specimen imports, because a specimen runs in the
  catalogue and resolves through the workspace root.
