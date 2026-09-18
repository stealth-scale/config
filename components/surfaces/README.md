# @stealthscale/component-surfaces

Draws the surfaces a page is built from: the card, a panel holding a picture, a header, a content
band and a footer. Every component binds a recipe and draws nothing of its own, so a theme restyles
all of them by extending the recipe. The preset under `./theme` registers the recipes with an
application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `Card.Root`.

## Install

```bash
pnpm add @stealthscale/component-surfaces
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Card

Draws a panel a reader takes in on its own: a picture, a header, the substance, and whatever they
act on.

```tsx
import { Card } from "@stealthscale/component-surfaces";

<Card.Root aria-labelledby="invoice-4821">
  <Card.Media>
    <img alt="" src="/invoice.png" />
  </Card.Media>
  <Card.Header>
    <Card.Indicator aria-hidden>●</Card.Indicator>
    <Card.Title id="invoice-4821">Invoice 4821</Card.Title>
    <Card.Description>Issued on 2 September</Card.Description>
    <Card.Aside>
      <IconButton aria-label="More" />
    </Card.Aside>
  </Card.Header>
  <Card.Content>Three lines, one unbilled.</Card.Content>
  <Card.Footer>
    <Button>Send</Button>
  </Card.Footer>
</Card.Root>;
```

| Axis          | Values                                                  | Default    |
| ------------- | ------------------------------------------------------- | ---------- |
| `variant`     | `elevated`, `outline`, `subtle`, `glass`                | `elevated` |
| `size`        | `sm`, `md`, `lg`, `xl`                                  | `md`       |
| `orientation` | `vertical`, `horizontal`                                | `vertical` |
| `radius`      | `l1`, `l2`, `l3`, `full`                                | `l2`       |
| `justify`     | `start`, `center`, `end`, `between`, `around`, `evenly` | `end`      |
| `status`      | `info`, `success`, `warning`, `error`                   | none       |
| `motion`      | `fade`, `rise`, `reveal`                                | none       |
| `divided`     | `true`                                                  | off        |
| `interactive` | `true`                                                  | off        |

### The parts

| Part          | Element   | What it draws                                   |
| ------------- | --------- | ----------------------------------------------- |
| `Root`        | `article` | The panel, and the variants every band reads    |
| `Media`       | `div`     | A picture, bled to the card's edges             |
| `Header`      | `div`     | A grid of three columns                         |
| `Indicator`   | `div`     | A glyph or avatar, in the header's first column |
| `Title`       | `h3`      | What the card is called                         |
| `Description` | `p`       | The line under the title                        |
| `Aside`       | `div`     | Controls, against the header's end              |
| `Content`     | `div`     | The substance, which takes the room left over   |
| `Footer`      | `div`     | Whatever a reader acts on                       |

The header is a grid, not a row of stacks. The indicator takes the first column and spans both
lines, the title and the description take the middle column on one line each, and the aside takes
the last column. A card with no indicator or no aside leaves that column at zero width.

### Naming a card

An `article` carries no name of its own, and an unnamed one is announced as `article` and nothing
more. Point `aria-labelledby` at the title's `id`, or state `aria-label`. A card that is part of its
surroundings rather than a composition of its own takes `as="div"` and needs no name.

### The picture

`Card.Media` takes back the room the root leaves, so the picture meets the card's edges and the root
clips its corners. Which edges it meets follows `orientation`: the top and both sides of a card
running down the page, the leading side of one running across it.

The band names nothing. Alternative text stays on the picture inside it, and a decorative picture
states `alt=""`.

### A card a reader presses

Set `interactive` and put a real link in the title:

```tsx
<Card.Root interactive>
  <Card.Header>
    <Card.Title>
      <Link to="/invoices/4821">Invoice 4821</Link>
    </Card.Title>
  </Card.Header>
</Card.Root>
```

The root draws its focus ring from `:focus-within`, so the whole card shows the focus while the
thing a keyboard reaches is the link. A press handler on the root would leave the card reachable by
pointer alone, and a `tabindex` on it would announce a control that says nothing.

### Rules between the bands

Set `divided` for a card whose header and footer are separated from the band between them. The rule
reads the root's own inset, so the room between a rule and the words steps with `size`.
