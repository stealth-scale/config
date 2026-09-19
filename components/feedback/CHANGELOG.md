# @stealthscale/component-feedback

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`85466a2`](https://github.com/stealth-scale/config/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-feedback: publish Alert
  
  - `Alert` draws a notice about something a reader needs to know. Six parts under one namespace:
    `Root`, `Indicator`, `Content`, `Title`, `Description` and `Aside`.
  - `live` decides the role that announces it: `assertive` draws `role="alert"`, `polite` draws
    `role="status"`, and `off` draws neither. The default is `polite`. A page of notices present at
    load takes `off`, because a live region announces itself on mount and would read every one of them
    out before a reader has asked for anything.
  - The indicator states `aria-hidden` by default. It repeats what the title says, so the status
    reaches a reader in words rather than through a palette and a glyph, which WCAG 1.4.1 fails.
  - `Alert.Title` is a `span`. A heading inside a live region puts a level into the page's outline for
    something that is gone a moment later, so a notice that stays takes `as="h2"`.
  - `Aside` holds what a reader does about the alert, which the source had no part for.
  - Six axes: `status` over the four intents and `neutral`, `variant` over the five flat looks,
    `size`, `layout` at `stacked` or `inline`, `radius` and `motion`.
  - The status names an intent rather than a hue, so a theme repointing `error` reaches every alert.
    Every other value is a semantic token, a layer style or a text style. The looks read the `flat`
    layer styles, whose fill and ink are the palette pairs the contrast gate measures, and the
    indicator takes no colour of its own so a solid alert marks itself in the measured ink.
  - The content band holds a minimum inline size of zero, so a long word wraps rather than pushing the
    aside off the end.

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

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`8041d27`](https://github.com/stealth-scale/config/commit/8041d27526629165ca78a37751f77ec66ac4ec3c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-feedback: publish the skeleton and the empty state
  
  - `Skeleton` stands in for content that has not arrived. It wraps that content rather than replacing
    it, so the stand-in comes out the size of the thing it stands in for without anybody stating a
    width, and it hides everything inside it until the content fades in. It takes a motion and a
    corner, each an axis of its recipe.
  - Every motion reads an animation style the theme states, so a reader who asked for reduced motion
    is served once in the theme rather than in every recipe.
  - `SkeletonText` stands in for a paragraph. A bar is one line tall and the space between two is half
    a line, both read off the line the bars stand in for, so a paragraph of stand-ins occupies what
    the real paragraph will and the page does not jump. The last bar of several is short.
  - `EmptyState` draws the panel a page shows where there is nothing to show, composed as
    `EmptyState.Root` holding a mark, a heading and a line saying what would be here. One size axis
    moves the room inside the panel, the gap in the content, the box of the mark and the size of the
    title together.
  - Neither the skeleton nor the panel carries a role. A page states `aria-busy` on whatever is
    waiting, which is one announcement rather than one per bar, and a page of empty panels is not a
    page of landmarks.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
