---
"@stealthscale/testing-react": minor
---

testing-react: read a part's ARIA and what it holds

`attr` reads the `data-` a component states about itself. What it owes a screen reader is written on
`aria-`, which no reader covered, so a specification asserting `aria-current` or `aria-expanded`
reached for `getAttribute`. `vp check --fix` rewrites that to `dataset`, which a strict `tsconfig`
then rejects for coming off an index signature.

Nesting had the same gap: an arrow's tip belongs inside the arrow, and saying so took a selector
written in the specification.

- aria(container, name, attribute): an `aria-` attribute, `undefined` where absent
- holds(container, outer, inner): whether one part is drawn inside another
