---
"@stealthscale/pandacss-compiler": minor
---

pandacss-compiler: drop the slot attribute from the generated slot binding

- `rewriteRuntime` rewrites a third file, `jsx/create-slot-recipe-context`, and drops the line that
  writes `data-slot` on a part, once in the provider and once in the part. Every part carries its
  slot class, `card__header`, which names the recipe and the slot, so the attribute repeated it. A
  rewrite that imports nothing marks its file with a comment on its first line.
