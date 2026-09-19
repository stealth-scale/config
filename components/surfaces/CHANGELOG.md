# @stealthscale/component-surfaces

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`18e2d59`](https://github.com/stealth-scale/config/commit/18e2d59bc110b9ab7f8f945e9ecc2a0bb1b48531) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-surfaces: publish Card
  
  - `Card` draws a panel a reader takes in on its own. Nine parts under one namespace: `Root`,
    `Media`, `Header`, `Indicator`, `Title`, `Description`, `Aside`, `Content` and `Footer`.
  - The root is an `article`, which a screen reader announces and lets a reader move between. It
    carries no name of its own, so point `aria-labelledby` at the title's `id` or state `aria-label`.
    A card that is part of its surroundings takes `as="div"`.
  - The header is a grid of three columns rather than a row of stacks. The indicator spans both lines
    of the title block, the title and the description take the middle column, and the aside sits
    against the end. A column with nothing in it is zero wide, so a card with no indicator needs no
    other arrangement.
  - `Media` takes back the room the root leaves, so a picture meets the card's edges and the root
    clips its corners. Which edges it meets follows `orientation`.
  - The root states its own inset as `--card-inset`, which the media reads back as a negative margin
    and the divided bands read as the room between a rule and the words. Both would otherwise be a
    length per step, which is a compound for every pair of `size` and the axis beside it.
  - Nine axes: `variant` over `elevated`, `outline`, `subtle` and `glass`; `size` over four steps;
    `orientation`; `radius`; `justify` for the footer's spread; `status`; `motion`; `divided`; and
    `interactive`.
  - `interactive` draws the root's focus ring from `:focus-within`, so the whole card shows the focus
    while the thing a keyboard reaches is the link in the title. A press handler on the root would
    leave the card reachable by pointer alone.
  - Two named compounds: `toned` draws the palette edge where a status meets a look that shows one,
    and `lifted` deepens the shadow where an interactive card is elevated.

### Patch Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`b271aae`](https://github.com/stealth-scale/config/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: hold every package to the barrel rule its ADR already states
  
  - ADR-0018 puts a specification beside every source file, the barrels included, and records that the
    conformance suite holds a package to it "where the package asks with `barrels: true`, which every
    component package does". Ten of the sixteen asked for nothing, so the rule was written down and
    enforced nowhere in them.
  - `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
    `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
    them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
    barrels, and `collections`' collection barrel.
  - A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
    binding is among them, which is what catches a leaked binding and a dropped export.
  - Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
    decision covers them and its enforcement note does not, so they are left for a pass of their own.

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

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
