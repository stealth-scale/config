# @stealthscale/component-collections

Draws many of a thing: the lists, tables and grids that render a set of records. Every component
binds a recipe and draws nothing of its own, so a theme restyles all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `Table.Root`.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Table

Draws a table of records, composed as `Table.Scroller` holding `Table.Root` and the bands a table is
built from.

```tsx
import { Table } from "@stealthscale/component-collections";

<Table.Scroller aria-labelledby="invoices" striped>
  <Table.Root>
    <Table.Caption id="invoices">Invoices this quarter</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader>Client</Table.ColumnHeader>
        <Table.ColumnHeader aria-sort="ascending" data-numeric>
          <Table.Sorter onClick={sortByTotal}>Total</Table.Sorter>
        </Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.RowHeader>Fathom</Table.RowHeader>
        <Table.Cell data-numeric>1,024.00</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Table.Scroller>;
```

| Axis           | Values                     | Default  |
| -------------- | -------------------------- | -------- |
| `variant`      | `line`, `outline`, `plain` | `line`   |
| `size`         | `sm`, `md`, `lg`           | `md`     |
| `align`        | `top`, `middle`, `bottom`  | `middle` |
| `layout`       | `auto`, `fixed`            | `auto`   |
| `radius`       | `l1`, `l2`, `l3`, `full`   | `l2`     |
| `striped`      | `true`                     | off      |
| `ruled`        | `true`                     | off      |
| `interactive`  | `true`                     | off      |
| `stickyHeader` | `true`                     | off      |
| `stickyColumn` | `true`                     | off      |

### The parts

| Part           | Element    | What it draws                          |
| -------------- | ---------- | -------------------------------------- |
| `Scroller`     | `div`      | The box a wide table scrolls inside    |
| `Root`         | `table`    | The table                              |
| `ColumnGroup`  | `colgroup` | The declaration of the table's columns |
| `Column`       | `col`      | One column, for its width and its tint |
| `Caption`      | `caption`  | What the table is about                |
| `Header`       | `thead`    | The row of column names                |
| `Body`         | `tbody`    | The rows of figures                    |
| `Footer`       | `tfoot`    | Whatever the rows add up to            |
| `Row`          | `tr`       | One line of cells                      |
| `ColumnHeader` | `th`       | A column's name, with `scope="col"`    |
| `Sorter`       | `button`   | The control that sorts the column      |
| `RowHeader`    | `th`       | A row's name, with `scope="row"`       |
| `Cell`         | `td`       | One figure                             |

### Reaching a wide table

`Table.Scroller` holds `tabIndex` at zero, because a region that scrolls has to be reachable by a
keyboard. WCAG 2.1.1 fails a table a pointer can scroll and a keyboard cannot.

Name it. A focusable box with no name is announced as nothing, so give the caption an `id` and point
the scroller's `aria-labelledby` at it.

### Naming the cells

`ColumnHeader` states `scope="col"` and `RowHeader` states `scope="row"`. A `th` without a scope is
guessed at, and the guess is wrong on any table that has both. With both, a screen reader reading
across a row names each cell by its column and by its row, so a reader six columns in still knows
where they are.

A cross-tab sets `stickyHeader` and `stickyColumn` together. The corner cell then pins to both edges
and sits above them.

### Columns of figures

State `data-numeric` on a cell and its header. The cell sets itself in tabular figures against its
end, so a column of numbers lines up at the decimal point.

It is an attribute rather than an axis because a slot recipe resolves its variants once at the root,
and a per-column switch cannot be one.

### Rows a reader presses

Set `interactive` and put a real link in a cell. The row lights up under the pointer and under the
keyboard alike, because it answers to focus within it. A `tr` holds no role a reader can act on, and
a `tabindex` on one announces a control that says nothing.

### Sorting and filtering

`Table.Sorter` draws the control and reports the press. `aria-sort` on the column header says which
way the column runs now. Both are presentation.

The sorting itself is not here, and neither is filtering, searching or pagination. A component that
filters has an opinion about the data it shows, which is the line between a component and a widget.
Drive these parts from a headless table library, or from the page.

### Column widths

`Table.ColumnGroup` holding `Table.Column` declares the columns. A table with `layout="fixed"` takes
its widths from there, which is one declaration rather than one on the first cell of every row.

A browser reads four things off a `col`: the width, the background, the border and whether the
column is drawn. Everything else stated on one is ignored, so tint and size a column from here and
style it from its cells.
