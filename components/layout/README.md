# @stealthscale/component-layout

Arranges what is already there and draws nothing of its own: a stack, a grid, the measure a page is
read at, a frame round a picture, a line between things and the room left over. Every component
binds a recipe and draws no surface, ink or border, so a theme moves all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

A layout answers to the room it is in rather than to the width of the window. A grid fits as many
columns of one measure as it has space for, and a stack wraps when its children will not sit in a
row. Nothing here reads a breakpoint and no page states one.

## Install

```bash
pnpm add @stealthscale/component-layout
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Stack

Lays its children out along one direction, a semantic gap apart. A row centres its children across
the flow and a column stretches them, so a row of a mark and a word states no alignment. The element
is `div`, and a stack of a list of things takes `as="ul"`.

```tsx
import { Spacer, Stack } from "@stealthscale/component-layout";

<Stack gap="lg">
  <p>One</p>
  <p>Two</p>
</Stack>;
<Stack direction="row" justify="between">
  <p>Title</p>
  <Spacer />
  <p>Action</p>
</Stack>;
```

| Axis        | Values                                                  | Default |
| ----------- | ------------------------------------------------------- | ------- |
| `direction` | `column`, `column-reverse`, `row`, `row-reverse`        | column  |
| `gap`       | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`       | `md`    |
| `justify`   | `start`, `center`, `end`, `between`, `around`, `evenly` | start   |
| `align`     | `flex-start`, `flex-end`, `stretch`, `baseline`         | by row  |
| `wrap`      | `true`                                                  | off     |

`align` carries the spellings CSS gives it because a class name carries the value and not the axis,
so `justify` and `align` cannot both offer `center`. A row centres its children already, which is
the case the short name would have been for.

## Grid

Lays its entries out in columns, as `Grid.Root` holding `Grid.Item`. The columns axis states a count
or a measure: a count draws that many equal columns, and `fit-<measure>` draws as many columns of
that measure as there is room for and wraps the rest. A column narrows rather than overflowing when
the grid is narrower than the measure.

```tsx
import { Grid } from "@stealthscale/component-layout";

<Grid.Root columns="fit-sm" gap="lg">
  <Grid.Item>One</Grid.Item>
  <Grid.Item>Two</Grid.Item>
</Grid.Root>;
<Grid.Root columns="12" gap="md">
  <Grid.Item span="8">Article</Grid.Item>
  <Grid.Item span="4">Aside</Grid.Item>
</Grid.Root>;
```

| Axis      | Values                                                  | Default | Styles   |
| --------- | ------------------------------------------------------- | ------- | -------- |
| `columns` | `1` to `12`, and `fit-xs` to `fit-8xl`                  | `1`     | the root |
| `gap`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`       | `md`    | the root |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | start   | the root |
| `align`   | `flex-start`, `flex-end`, `stretch`, `baseline`         | stretch | the root |
| `flow`    | `row`, `column`, `dense`                                | row     | the root |
| `span`    | `1` to `12`, and `full`                                 | one     | the item |

## Container

Holds a page to one measure and centres it in whatever holds it, with a gutter down each side. The
element is `div`, and a page whose container is its main region takes `as="main"`.

```tsx
import { Container } from "@stealthscale/component-layout";

<Container size="prose">
  <p>Running text at the measure it is read at.</p>
</Container>;
<Container as="main" size="6xl" />;
```

| Axis    | Values                              | Default |
| ------- | ----------------------------------- | ------- |
| `size`  | `xs` to `8xl`, `prose`, `full`      | `3xl`   |
| `flush` | `true`, which takes the gutter away | off     |

## Frame

Holds a picture, a video or a map to one shape, clipped to its corners. Whatever the frame holds is
drawn at the frame's own size, so a picture of any dimensions fills the shape rather than setting
it. The frame names nothing itself, so the alternative text stays with the picture inside it.

```tsx
import { Frame } from "@stealthscale/component-layout";

<Frame ratio="video" radius="l2">
  <img alt="A hillside at dusk" src="/hill.avif" />
</Frame>;
<Frame radius="full">
  <img alt="Ada Lovelace" src="/ada.avif" />
</Frame>;
```

| Axis     | Values                                                                    | Default  |
| -------- | ------------------------------------------------------------------------- | -------- |
| `ratio`  | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide` | `square` |
| `radius` | `l1`, `l2`, `l3`, `full`                                                  | none     |
| `fit`    | `cover`, `contain`                                                        | `cover`  |

## Divider

Draws one line between things. The element is `hr`, which a browser gives the separator role, so a
reader is told that what follows is apart from what came before. A divider standing up in a row
states `aria-orientation="vertical"` beside its variant.

```tsx
import { Divider } from "@stealthscale/component-layout";

<Divider />;
<Divider aria-orientation="vertical" orientation="vertical" />;
```

| Axis          | Values                   | Default      |
| ------------- | ------------------------ | ------------ |
| `orientation` | `horizontal`, `vertical` | `horizontal` |

## Spacer

Takes the room a stack has left over, which pushes what follows it to the far end. It holds nothing
and is hidden from assistive technology, because empty room is not something a reader is told about.

## Licence

MIT. See [LICENSE](LICENSE).
