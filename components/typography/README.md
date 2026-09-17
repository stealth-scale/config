# @stealthscale/component-typography

Draws the components that are text: a heading, a paragraph, a snippet of code, a key a reader is
asked to press, a mark, a list and a quotation. Every component binds a recipe and draws nothing of
its own, so a theme moves all of them by extending the recipe. The preset under `./theme` registers
the recipes with an application's compiler.

Every value a theme can move on a component is an axis of its recipe, so a caller reaches it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `List.Root` and `Blockquote.Content`.

## Install

```bash
pnpm add @stealthscale/component-typography
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Text

Draws a paragraph, in a size, an ink, a weight and an alignment, cut to one line where a caller
asks, and moved or masked where a page wants it. The element is `p`. A truncated or masked paragraph
hides words. The full words are the caller's to keep reachable, in a `title` or in text nearby.

```tsx
import { Text } from "@stealthscale/component-typography";

<Text size="lg" tone="muted" weight="medium">
  A sentence set large, muted and a little heavier.
</Text>;
<Text as="span" truncate>
  A run of words inside a line, cut at its box.
</Text>;
```

| Axis       | Values                                                                | Default |
| ---------- | --------------------------------------------------------------------- | ------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`                                          | `md`    |
| `tone`     | `default`, `muted`, `inverted`, `info`, `success`, `warning`, `error` | inherit |
| `weight`   | `normal`, `medium`, `semibold`, `bold`                                | inherit |
| `align`    | `start`, `center`, `end`, `justify`                                   | inherit |
| `truncate` | `true`                                                                | off     |
| `motion`   | `fade`, `rise`, `reveal`                                              | none    |
| `mask`     | `bottom`                                                              | none    |

## Heading

Draws a heading, in a heading role, an ink, an effect and a motion, at the level `as` names. The
element is `h2`, and the size states how loud the heading is rather than which level it is.

```tsx
import { Heading } from "@stealthscale/component-typography";

<Heading as="h1" size="2xl" effect="gradient">
  A page title
</Heading>;
<Heading motion="reveal">A section title that rises into view</Heading>;
```

| Axis       | Values                                                                | Default |
| ---------- | --------------------------------------------------------------------- | ------- |
| `size`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                     | `lg`    |
| `tone`     | `default`, `muted`, `inverted`, `info`, `success`, `warning`, `error` | inherit |
| `effect`   | `gradient`, `shine`                                                   | none    |
| `motion`   | `fade`, `rise`, `reveal`                                              | none    |
| `truncate` | `true`                                                                | off     |

## Code

Draws a snippet of code inside a line, in a look, a size and the palette of its status. The element
is `code`.

```tsx
import { Code } from "@stealthscale/component-typography";

<Code>pnpm add</Code>;
<Code variant="solid" status="error">
  ENOENT
</Code>;
```

| Axis      | Values                                           | Default  |
| --------- | ------------------------------------------------ | -------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain` | `subtle` |
| `size`    | `sm`, `md`                                       | `md`     |
| `status`  | `info`, `success`, `warning`, `error`            | none     |

## Kbd

Draws a key a reader is asked to press, as a keycap in a look, a size and the palette of its status.
The element is `kbd`.

```tsx
import { Kbd } from "@stealthscale/component-typography";

<Kbd>⌘</Kbd>;
<Kbd variant="outline" size="sm">
  Esc
</Kbd>;
```

| Axis      | Values                                 | Default  |
| --------- | -------------------------------------- | -------- |
| `variant` | `raised`, `outline`, `subtle`, `plain` | `raised` |
| `size`    | `sm`, `md`, `lg`                       | `md`     |
| `status`  | `info`, `success`, `warning`, `error`  | none     |

## Icon

Draws the artwork a caller hands in, at a size, in an ink and with a motion, and ships no mark of
its own. The element is `svg` in the `img` role, hidden from assistive technology unless a caller
labels it with `aria-hidden={false}` and `aria-label`. A mark that points is `mirrored`, so it flips
in a right-to-left page.

```tsx
import { Icon } from "@stealthscale/component-typography";

<Icon size="md" tone="warning" viewBox="0 0 24 24">
  <path d="M12 2 2 22h20Z" />
</Icon>;
<Icon motion="spin" aria-hidden={false} aria-label="Loading" viewBox="0 0 24 24">
  <path d="M12 2a10 10 0 1 0 10 10" />
</Icon>;
```

| Axis       | Values                                                       | Default   |
| ---------- | ------------------------------------------------------------ | --------- |
| `size`     | `inherit`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `inherit` |
| `tone`     | `current`, `muted`, `info`, `success`, `warning`, `error`    | inherit   |
| `motion`   | `spin`, `float`, `twinkle`                                   | none      |
| `mirrored` | `true`                                                       | off       |

## List

Draws a list, as `List.Root` holding `List.Item`, each with a `List.Indicator` where the caller
draws the mark. The root is `ul`, and `as="ol"` numbers the entries. The root takes the variants and
every entry draws them. The indicator is hidden from assistive technology, as the browser's own
bullet is, so a mark inside it is not read aloud before every entry.

```tsx
import { List } from "@stealthscale/component-typography";

<List.Root as="ol" gap="sm">
  <List.Item>First</List.Item>
  <List.Item>Second</List.Item>
</List.Root>;
<List.Root variant="plain" motion="rise">
  <List.Item>
    <List.Indicator>✓</List.Indicator>
    Done
  </List.Item>
</List.Root>;
```

| Axis      | Values                                                                                                                                   | Default       | Styles                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| `variant` | `marker`, `plain`                                                                                                                        | `marker`      | the root and the item |
| `gap`     | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                                                                                        | `md`          | the root              |
| `align`   | `start`, `center`, `end`                                                                                                                 | inherit       | the item              |
| `marker`  | `disc`, `circle`, `square`, `dash`, `decimal`, `leading-zero`, `lower-roman`, `upper-roman`, `lower-alpha`, `upper-alpha`, `lower-greek` | the element's | the item              |
| `motion`  | `rise`, `reveal`                                                                                                                         | none          | the item              |

## Blockquote

Draws a quotation, as `Blockquote.Root` holding `Blockquote.Icon`, `Blockquote.Content` and
`Blockquote.Caption`. The root is `figure`, the content `blockquote` and the caption `figcaption`.
The icon is the library's own `Icon` bound to the quotation's icon slot, so it takes the icon's size
and the quotation's colour.

```tsx
import { Blockquote } from "@stealthscale/component-typography";

<Blockquote.Root variant="solid" status="info" motion="reveal">
  <Blockquote.Icon size="lg" viewBox="0 0 24 24">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </Blockquote.Icon>
  <Blockquote.Content>
    Perfection is reached when there is nothing left to take away.
  </Blockquote.Content>
  <Blockquote.Caption>Antoine de Saint-Exupéry</Blockquote.Caption>
</Blockquote.Root>;
```

| Axis      | Values                                | Default  | Styles                   |
| --------- | ------------------------------------- | -------- | ------------------------ |
| `variant` | `subtle`, `solid`, `plain`, `glass`   | `subtle` | the root and the icon    |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`          | `md`     | the root and the content |
| `justify` | `start`, `center`, `end`              | `start`  | the root                 |
| `status`  | `info`, `success`, `warning`, `error` | none     | the root                 |
| `motion`  | `rise`, `reveal`                      | none     | the root                 |

## Types

| Type                   | Declaration | What it describes                                        |
| ---------------------- | ----------- | -------------------------------------------------------- |
| `TextProps`            | `type`      | The paragraph's variants and everything a `p` takes      |
| `HeadingProps`         | `type`      | The heading's variants and everything an `h2` takes      |
| `CodeProps`            | `type`      | The snippet's variants and everything a `code` takes     |
| `KbdProps`             | `type`      | The key's variants and everything a `kbd` takes          |
| `IconProps`            | `type`      | The icon's variants and everything an `svg` takes        |
| `List.RootProps`       | `type`      | The list's variants and everything a `ul` takes          |
| `List.ItemProps`       | `type`      | Everything an `li` takes                                 |
| `Blockquote.RootProps` | `type`      | The quotation's variants and everything a `figure` takes |

## Licence

MIT. See [LICENSE](LICENSE).
