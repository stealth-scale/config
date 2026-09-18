# @stealthscale/component-actions

## 0.1.1

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`c9f0233`](https://github.com/stealth-scale/config/commit/c9f0233e3357bed7c6161d6a7fd9a03fdab1da4e) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-actions: publish the button and the icon button
  
  - `Button` binds a `button` element through the compiler's factory with `type` defaulted to
    `button`, so a caller changes the element with `as`. `ButtonPropsProvider` sets the variants of
    every button below it.
  - The recipe offers the six looks and a glass look, the eight control sizes up to a hero's `4xl`,
    the four statuses, a square shape and the glow effect, each a layer style, a semantic scale step
    or a palette a theme moves.
  - A button takes an `elevation`, `raised` or `floating`, which lifts under a pointer and drops
    towards the page under a press, and a `ripple` beside the `glow`.
  - `IconButton` binds the same recipe with the square shape as its default, and its props require
    `aria-label` or `aria-labelledby`. A compound clears the inset a leading mark takes off it, so a
    square button holding one mark keeps the mark centred.
  - The preset under `./theme` registers the recipe.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
