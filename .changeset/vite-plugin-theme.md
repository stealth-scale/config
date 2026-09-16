---
"@stealthscale/vite-plugin-theme": patch
---

vite-plugin-theme: declare the class a compound's styles are emitted under

- The generated `recipes/runtime.d.mts` types `className` on a recipe's compound and `classNames` on
  a slot recipe's, which the runtime reads and the recipe writes.
