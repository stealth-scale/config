# @stealthscale/component-collections

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/config/pull/35) [`e4af4b0`](https://github.com/stealth-scale/config/commit/e4af4b04bef831df838cd56ee3401ce8a7222204) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-collections: publish Listbox, useListCollection and useFilter
  
  - `Listbox` draws a list of rows a person picks from, with the keys the ARIA pattern calls for. Ten
    parts under one namespace. It binds Zag's listbox machine, which writes every role, every
    identifier and every key.
  - Every part is a `div`. A listbox is a grouping for a screen reader rather than a list of items,
    and drawing it as one nested an `li` with `role="option"` inside an `li` with `role="group"`,
    which axe reports as `aria-allowed-role`.
  - `highlight` marks the row the keys are on rather than the row that has focus, because a listbox
    driven from a field never moves focus off the field. `highlightVariants` now takes the condition
    to write against, so this reads `_highlighted` while a navigation reads `_currentPage`.
  - Four axes: `highlight`, `radius`, `size` and `variant`.
  - Rows go in through `collection`, so the component holds no matching of its own.
  
  - `useListCollection` holds the rows a list draws and the text typed, and answers what is left of
    them. A caller passes a predicate to match on the words a reader sees or on anything else the row
    holds, and `narrow("")` restores every row.
  - `useFilter` answers `contains`, `startsWith` and `endsWith` over `Intl.Collator`, so `Jose`
    matches `José` and `strasse` matches `Straße`. The default sensitivity ignores case and accents,
    which is what a person typing into a search field expects.
  - `ListCollection` is re-exported from the engine rather than retyped, so a consumer naming it in a
    declaration file resolves it without declaring the engine themselves.
  
  component-collections: publish Table
  
  - `Table` draws a table of records. Thirteen parts under one namespace: `Scroller`, `Root`,
    `ColumnGroup`, `Column`, `Caption`, `Header`, `Body`, `Footer`, `Row`, `ColumnHeader`, `Sorter`,
    `RowHeader` and `Cell`. Every part binds the element a browser already gives the meaning to.
  - `Scroller` is the box a wide table scrolls inside, and it holds `tabIndex` at zero. WCAG 2.1.1
    fails a region a pointer can scroll and a keyboard cannot, and it is the failure a table component
    is most often reported for.
  - `ColumnHeader` states `scope="col"` and `RowHeader` states `scope="row"`. A `th` without a scope
    is guessed at, and the guess is wrong on any table carrying both.
  - `Sorter` draws the control that sorts a column, as a button inside the header rather than a
    pressable `th`. The header keeps `aria-sort`. Sorting, filtering and pagination stay with the
    page: a component that filters has an opinion about the data it shows.
  - `ColumnGroup` and `Column` declare the table's columns, so a fixed layout states its widths once
    rather than on the first cell of every row.
  - Ten axes: `variant`, `size`, `align`, `layout`, `radius`, `striped`, `ruled`, `interactive`,
    `stickyHeader` and `stickyColumn`.
  - `interactive` lights a row under the keyboard as well as the pointer, through focus within it. A
    `tr` holds no role a reader can act on, so the link in a cell carries the behaviour.
  - `stickyColumn` holds the row's own name still while the table scrolls sideways. Set beside
    `stickyHeader`, a compound pins the corner cell to both edges above them.
  - A cell of figures states `data-numeric`, which sets it in tabular figures against its end. It is
    an attribute rather than an axis, because a slot recipe resolves its variants once at the root.
  - Every value is a semantic token or a helper's. The stripe and the hover reach the body's own rows
    rather than every row of the table, since `:nth-of-type` counts within a parent.

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

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
