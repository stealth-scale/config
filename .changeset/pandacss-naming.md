---
"@stealthscale/pandacss-naming": minor
---

pandacss-naming: write every class name in one readable scheme

- `variantClass("button", "size", "lg")` returns `button--lg`,
  `variantClass("button", "loading", true)` returns `button--loading`, and `false` returns an empty
  string, so an element carries no class for the absence of a state.
- `slotClass("card", "content")` returns `card__content`, and `compoundClass("button", "expose")`
  returns `button--expose`, the name the author gave the compound.
- `atomicClass` writes a named condition and the property's class in kebab-case and sanitises the
  value: `grid-ar-{sizes.32}` becomes `grid-ar-sizes-32`, `md:grid-tc-repeat(3,_minmax(0,_1fr))`
  becomes `md:grid-tc-repeat-3-minmax-0-1fr`, and `layerStyle-dim.others` becomes
  `layer-style-dim-others`. A raw selector or at-rule condition is kept as written.
- `rename(pandaClass, config)` reads a class the compiler wrote as a variant where one of
  `config.recipes` claims it, and as an atomic class otherwise.
