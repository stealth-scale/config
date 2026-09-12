---
"@stealthscale/vite-config-react": minor
---

Excuse a specification written as markup the docblock rules, as the toolchain already excuses one
written as plain TypeScript. `lint.preset.web()` had the globs for it, but `lint` is read from the
root config and nowhere else, and a root takes the node tier whatever its packages render — so the
tier holding that answer was never the one the linter read. A `.spec.tsx` was therefore held to a
standard the same file in `.ts` is excused, which in a component library is every specification
there is.
