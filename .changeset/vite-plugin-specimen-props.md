---
"@stealthscale/vite-plugin-specimen": minor
---

resolve what a page's components accept out of their types

- `props` on the options serves `virtual:specimen-props/<id>`, which maps every part onto the props
  it takes, the named types those refer to, and what was dropped.
- Classify a property by every declaration behind it rather than the first, which keeps `gap` on a
  list and `aria-label` on an icon button where the style props and the rendering library share
  those names.
- Drop a property with no declaration at all, which is what a styling condition resolves to, so no
  pattern names the conditions.
- Read a recipe file for a variant and the component's own package for an option, both through the
  compiler's own metadata for where a file sits, so a repository states no path.
- Report the dropped counts rather than hiding them. A button resolves to 1341 properties, six of
  which are its own.
- Expand a union written under a name into its options, so `size: Scale` reads as its eight steps.
- Skip a type from TypeScript's own libraries.
- `typescript` is an optional peer, loaded on the first page that carries props.

218 tests, 100% on all four metrics.
