# @stealthscale/component-typography

Draws the components that are text: a heading, a paragraph, a snippet of code, a key a reader is
asked to press, a stressed run, an important run, a mark, a list and a quotation. Every component
binds a recipe and draws nothing of its own, so a theme restyles all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `List.Root` and `Blockquote.Content`.

## Install

```bash
pnpm add @stealthscale/component-typography
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Text

Draws a paragraph, in a size, an ink, a weight and an alignment, cut to one line where a caller sets
`truncate`, and animated or masked where a page sets those axes. The element is `p`. A truncated or
masked paragraph hides words. The full words are the caller's to keep reachable, in a `title` or in
text nearby.

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
element is `h2`, and the size states the heading's prominence rather than its level.

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

## Em

Marks a run of words the writer stressed. The element is `em`, and it exposes the `emphasis` role.
The italic is a declaration of the recipe rather than the browser's default, so a theme reaches it
and a face with no italic can be given a substitute.

```tsx
import { Em } from "@stealthscale/component-typography";

<Em>never</Em>;
<Em tone="error">deleted</Em>;
<Em as="i">Beagle</Em>;
```

| Axis     | Values                                                                | Default |
| -------- | --------------------------------------------------------------------- | ------- |
| `tone`   | `default`, `muted`, `inverted`, `info`, `success`, `warning`, `error` | inherit |
| `motion` | `fade`, `rise`, `reveal`                                              | none    |

Set `as="i"` for a run drawn in italic for another reason, such as a ship's name or a term being
introduced. That element states no stress.

## Strong

Marks a run of words as more important than the words around it. The element is `strong`, and it
exposes the `strong` role.

```tsx
import { Strong } from "@stealthscale/component-typography";

<Strong>Do not</Strong>;
<Strong weight="bold" tone="error">
  Deleting is permanent
</Strong>;
```

| Axis     | Values                                                                | Default    |
| -------- | --------------------------------------------------------------------- | ---------- |
| `weight` | `medium`, `semibold`, `bold`                                          | `semibold` |
| `tone`   | `default`, `muted`, `inverted`, `info`, `success`, `warning`, `error` | inherit    |
| `motion` | `fade`, `rise`, `reveal`                                              | none       |

The weight scale's `normal` step is left out. A run at the same weight as the text around it reads
as ordinary text, so the value would draw no distinction. The browser's `bolder` keyword is not
read, because it resolves against the inherited weight and reaches a different step in each context.
Set `as="b"` for a run drawn heavy for another reason, such as a keyword in a definition.

## Mark

Picks a run of words out of the text around it, for a search hit or a term a page wants noticed. The
element is `mark`, and it exposes the `mark` role. `MarkPropsProvider` sets the variants of every
mark below it, which is how a list of results draws its hits alike.

```tsx
import { Mark, MarkPropsProvider } from "@stealthscale/component-typography";

<Mark>chassis</Mark>;
<MarkPropsProvider value={{ radius: "l1", status: "warning", variant: "solid" }}>
  <Results />
</MarkPropsProvider>;
```

| Axis      | Values                                                   | Default  |
| --------- | -------------------------------------------------------- | -------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain`, `text` | `subtle` |
| `status`  | `info`, `success`, `warning`, `error`                    | none     |
| `radius`  | `l1`, `l2`, `l3`, `full`                                 | none     |
| `inset`   | `xs`, `sm`, `md`                                         | none     |
| `motion`  | `fade`, `rise`, `reveal`                                 | none     |
| `effect`  | `glow`, `shine`                                          | none     |

A screen reader announces the run's boundaries only where the reader has turned that on, so a
highlight that carries meaning needs a second cue. The `text` variant supplies one in weight. Where
the meaning has to be spoken, put it in a `VisuallyHidden` beside the run. WCAG 1.4.1 fails a
distinction drawn in colour alone.

The base clones the box decoration, so a highlight that runs onto a second line carries its inset
and its corners onto both. The inset opens the inline axis alone: block padding on an inline box
overflows into the line above rather than opening the line.

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

Draws the artwork a caller passes in, at a size, in an ink and with a motion, and ships no artwork
of its own. The element is `svg` in the `img` role, hidden from assistive technology unless a caller
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
| `EmProps`              | `type`      | The run's variants and everything an `em` takes          |
| `StrongProps`          | `type`      | The run's variants and everything a `strong` takes       |
| `MarkProps`            | `type`      | The highlight's variants and everything a `mark` takes   |
| `KbdProps`             | `type`      | The key's variants and everything a `kbd` takes          |
| `IconProps`            | `type`      | The icon's variants and everything an `svg` takes        |
| `List.RootProps`       | `type`      | The list's variants and everything a `ul` takes          |
| `List.ItemProps`       | `type`      | Everything an `li` takes                                 |
| `Blockquote.RootProps` | `type`      | The quotation's variants and everything a `figure` takes |

## Licence

MIT. See [LICENSE](LICENSE).
