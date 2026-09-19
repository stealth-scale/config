# @stealthscale/component-navigation

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`a4b1d24`](https://github.com/stealth-scale/config/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-navigation: publish NavList
  
  - `NavList` draws the list of destinations a sidebar or a page is moved around by. Ten parts under
    one namespace, with a link, a nested list, a badge and the control that opens a branch.
  - It belongs here rather than in the screen package, because what it draws is a way of moving
    between places. The screen package lays out the room it sits in.
  - `highlight` marks the destination a reader is on: `bar` draws a rule down its leading edge, `fill`
    fills it solidly, and `tint` fills it faintly. The mark is written against `_currentPage`, which
    is the condition `aria-current="page"` sets, so the mark and what a screen reader announces cannot
    disagree.
  - `reveal` decides when the control beside a row is drawn. `always` draws it, and `hover` draws it
    under a pointer, under a coarse pointer that has no hover, and while anything in the row holds
    focus. The rule for the last of those selected `[data-part=action]`, which nothing in this
    repository stamps, so it matched nothing: a keyboard reached a control at `opacity: 0` and a
    pointer revealed none either. It selects the class the binding writes.
  - `variant` takes `list` for a column of rows and `dock` for a bar across the foot of a phone, which
    keeps clear of the home indicator through the theme's safe-area spacing.
  - `iconic` collapses the list to a rail of marks. Each destination keeps its words under `srOnly`,
    so a screen reader still names it and the words take no room inside the square.
  - Six axes: `highlight`, `iconic`, `radius`, `reveal`, `size` and `variant`.

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
- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
  - @stealthscale/hooks@0.1.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`03d7d45`](https://github.com/stealth-scale/config/commit/03d7d4596ab137b8460b355bf72f4ad3519025bc) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-navigation: publish the link and the breadcrumb trail
  
  - `Link` draws words a person follows to somewhere else. The ink, the visited ink, the cursor and
    the focus ring all come from the theme's own link fragment, so a theme decides what a link looks
    like once for every link. Its one axis decides whether the underline is drawn at rest or only
    under a pointer, and both looks underline under one.
  - `Breadcrumb` draws the path from the front of a site to the page a person is on, composed as
    `Breadcrumb.Root` holding a list of crumbs. The size sets the text on the root and the gap on the
    list, so every part reads at one size by inheriting it.
  - The last crumb is `Breadcrumb.CurrentLink` rather than a link. It draws a span carrying
    `aria-current="page"`, which tells a screen reader which crumb is where the reader is, and a link
    to the page already open would be a control that does nothing.
  - The landmark is named `Breadcrumb` by default, because a page usually holds more than one
    navigation landmark and an unnamed one is announced with nothing to tell it from the others. The
    list states its own list role, because a list drawn with no marker loses that role in Safari. The
    separator sits between two crumbs as a row of the list rather than inside one, so a screen reader
    counting the list counts the crumbs, and it carries `aria-hidden` because the order is already in
    the list.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
