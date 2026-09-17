---
"@stealthscale/pandacss-compiler": minor
---

pandacss-compiler: rename a compiled stylesheet and its runtime into the scheme

- `rewriteRuntime(dir)` rewrites the lines of the generated runtime that write a class, in `helpers`
  and in `recipes/runtime`, so an atomic, a variant and a compound class pass the scheme, and
  prepends an import of `@stealthscale/pandacss-naming` to each file. Each line is matched once, as
  `@pandacss/compiler` 2.0.0-beta.17 writes it, and a release that moves a line throws.
- `renameSelectors(css, config)` renames each class in each selector through one parse, removes
  every selector that needs the class of a boolean axis at `false`, keeps `:not()` of it as written,
  prunes every block that leaves empty, and returns the stylesheet with a diagnostic for each
  collision, one for the classes whose rules were removed, and one for the classes kept under a raw
  condition at any depth.
- `compilerConfig(config)` reads every recipe with its class, axes and slots, and the separator, out
  of the driver's resolved configuration.
