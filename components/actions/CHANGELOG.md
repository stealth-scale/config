# @stealthscale/component-actions

## 0.1.1

### Patch Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`a4b1d24`](https://github.com/stealth-scale/config/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: emit a rule for every status a component can be handed
  
  - Every recipe with a `status` axis now carries `statusEmitted()` under `staticCss`: `Button`,
    `Badge`, `Alert`, `Checkbox`, `Field`, `Fieldset`, `Input`, `Switch`, `Textarea`, `Card`,
    `Blockquote`, `Code`, `Kbd` and `Mark`.
  - The compiler emits a rule for a value it reads from a literal in an application's source. An
    application writes `status={row.status}` rather than `status="error"`, so the compiler read a name
    it could not follow. The runtime still wrote the class, and the component drew in its default
    palette while reporting an error.
  - Measured on the single-theme example, which writes `status="error"` and the other three nowhere:
    the stylesheet held a rule for `error` alone before, and for all four after, at 0.19 kB over the
    wire.
  - `recipe.emitted` in the theme's test kit reports a recipe that offers a status and lists none, so
    a new one cannot be written without it.
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
