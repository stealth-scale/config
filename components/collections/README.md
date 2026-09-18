# @stealthscale/component-collections

Draws many of a thing: the lists, tables and grids that render a set of records.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component draws with `as`. A component with parts is published as a
namespace, `Table.Root`.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react` and `@stealthscale/theme`. List the preset under `./theme` among the
presets your compiler installs.

## Table

Draws a table of records.

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

Name the scroller. Give the caption an `id` and point the scroller's `aria-labelledby` at it. The
scroller is reachable by a keyboard, and a focusable box with no name is announced as nothing.

Write a column's name in `ColumnHeader` and a row's in `RowHeader`. A screen reader reading across a
row then names each cell by its column and by its row.

Set `stickyHeader` and `stickyColumn` together for a cross-tab. The corner cell pins to both edges.

State `data-numeric` on a cell and its header for a column of figures. The cell sets itself in
tabular figures against its end, so the numbers line up at the decimal point.

Set `interactive` and put a real link in a cell for rows a reader presses. The row lights up under
the pointer and the keyboard alike.

`Table.Sorter` draws the control and reports the press. State `aria-sort` on the column header.
Sorting, filtering and pagination are the page's: drive these parts from a headless table library.

Declare the columns in `Table.ColumnGroup` for a table with `layout="fixed"`. A browser reads a
`col`'s width, background, border and visibility and ignores everything else, so tint and size a
column there and style it from its cells.

## Licence

MIT. See [LICENSE](LICENSE).
