---
"@stealthscale/component-collections": minor
---

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
