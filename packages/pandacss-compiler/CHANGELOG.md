# @stealthscale/pandacss-compiler

## 0.1.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - pandacss-compiler: rename a compiled stylesheet and its runtime into the scheme
  
  - `rewriteRuntime(dir, separator)` rewrites the lines of the generated runtime that write a class,
    in `helpers` and in `recipes/runtime`, so an atomic, a variant and a compound class pass the
    scheme under the separator the compiler was configured with, and prepends an import of
    `@stealthscale/pandacss-naming` to each file. Each line is matched once, as `@pandacss/compiler`
    2.0.0-beta.17 writes it, and a release that moves a line throws.
  - `renameSelectors(css, config)` renames each class in each selector through one parse, removes
    every selector that needs the class of a boolean axis at `false`, keeps `:not()` of it as written,
    prunes every block that leaves empty, and returns the stylesheet with a diagnostic for each
    collision, one for the classes whose rules were removed, and one for the classes kept under a raw
    condition at any depth.
  - `compilerConfig(config)` reads every recipe with its class, axes and slots, and the separator, out
    of the driver's resolved configuration.

### Patch Changes

- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-naming@0.1.0
