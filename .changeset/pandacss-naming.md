---
"@stealthscale/pandacss-naming": minor
---

pandacss-naming: write every class name in one readable scheme

- `variantClass("button", "size", "lg")` returns `button--lg`,
  `variantClass("button", "loading", true)` returns `button--loading`, and `false` returns an empty
  string, so an element carries no class for the absence of a state.
- `slotClass("card", "content")` returns `card__content`, and `compoundClass("button", "expose")`
  returns `button--expose`, the name the author gave the compound.
- `atomicClass(pandaClass, separator)` writes a named condition and the property's class in
  kebab-case, the separator as a hyphen, and the value sanitised: `grid-ar_{sizes.32}` becomes
  `grid-ar-sizes-32`, `md:grid-tc_repeat(3,_minmax(0,_1fr))` becomes
  `md:grid-tc-repeat-3-minmax-0-1fr`, `layerStyle_dim.others` becomes `layer-style-dim-others`, and
  `m_-4` keeps its sign as `m--4`. A raw selector or at-rule condition is kept as written.
- `rename(pandaClass, config)` reads a class the compiler wrote as a variant where one of
  `config.recipes` claims it, reading the longest axis that fits, and as an atomic class otherwise.
- `conditionsOf(pandaClass)` lists the conditions of a class, outer to inner, with a raw one in its
  brackets.
