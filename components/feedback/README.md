# @stealthscale/component-feedback

Draws the system reporting on itself: what is loading, what went wrong, what state a thing is in.
Every component binds a recipe and draws nothing of its own, so a theme restyles all of them by
extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-feedback
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Alert

Draws a notice about something a reader needs to know, composed as `Alert.Root` holding a mark, the
words, and whatever they do about it.

```tsx
import { Alert } from "@stealthscale/component-feedback";

<Alert.Root live="assertive" status="error">
  <Alert.Indicator>
    <WarningIcon />
  </Alert.Indicator>
  <Alert.Content>
    <Alert.Title>Payment failed</Alert.Title>
    <Alert.Description>The card was declined.</Alert.Description>
  </Alert.Content>
  <Alert.Aside>
    <IconButton aria-label="Dismiss this warning" />
  </Alert.Aside>
</Alert.Root>;
```

| Axis      | Values                                           | Default   |
| --------- | ------------------------------------------------ | --------- |
| `status`  | `info`, `success`, `warning`, `error`, `neutral` | `info`    |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `plain` | `subtle`  |
| `size`    | `sm`, `md`, `lg`                                 | `md`      |
| `layout`  | `stacked`, `inline`                              | `stacked` |
| `radius`  | `l1`, `l2`, `l3`, `full`                         | `l3`      |
| `motion`  | `fade`, `rise`, `reveal`                         | none      |

The status picks the palette and nothing else, so one set of looks and sizes draws a warning and an
error alike, and a theme retints every alert at once.

### How loudly it is announced

`live` decides the role, and the role decides whether a reader who is not looking at the alert hears
it.

| `live`      | Role     | Reach for it when                                   |
| ----------- | -------- | --------------------------------------------------- |
| `assertive` | `alert`  | The alert answers something a person just did       |
| `polite`    | `status` | The alert reports progress and can wait for a pause |
| `off`       | none     | The alert is on the page from the first paint       |

The default is `polite`. A page of notices present at load takes `off`: a live region announces
itself on mount, so every one of them would be read out before a reader has asked for anything.

A live region announces what changes inside it once it is in the document. An alert mounted with its
words already in place may reach a reader late or not at all, so a page that raises alerts keeps the
region mounted and empty and fills it.

### Saying the status in words

The indicator states `aria-hidden` by default. It repeats what the title says, and a reader hearing
the alert read out does not need a glyph named first. That puts the status in the title's words,
which is where it has to be: an alert whose status reaches a reader through its palette and its mark
alone fails WCAG 1.4.1.

Name a control in the aside for what it acts on. `Dismiss` alone is read out of context by a screen
reader moving control to control, where `Dismiss this warning` is not.

`Alert.Title` is a `span`, not a heading, because a heading inside a live region puts a level into
the page's outline for something that is gone a moment later. A notice that stays and belongs in the
outline takes `as="h2"`.

## Skeleton

Stands in for content that has not arrived. It wraps that content rather than replacing it, so a
caller writes one tree and sets one prop, and the stand-in comes out the size of the thing it stands
in for without anybody stating a width. While it waits it hides everything inside it. Once the
content arrives the stand-in fades out and the content is shown.

```tsx
import { Skeleton } from "@stealthscale/component-feedback";

<Skeleton loading={pending}>
  <Avatar src={person.photo} />
</Skeleton>;
<Skeleton motion="shimmer" radius="full" />;
```

| Axis      | Values                     | Default |
| --------- | -------------------------- | ------- |
| `loading` | `true`, `false`            | `true`  |
| `motion`  | `none`, `pulse`, `shimmer` | `pulse` |
| `radius`  | `l1`, `l2`, `l3`, `full`   | `l2`    |

The element carries no role. A reader learns more from being told the region is busy than from being
told each box is, so a page states `aria-busy` on whatever is waiting and each bar announces nothing
of its own.

## SkeletonText

Stands in for a paragraph of text. Every length is read off the line it stands in for, so a bar is
one line tall and the space between two is half a line. Place it where text is read and it comes out
the size of that text, so the page does not jump when the real words replace it.

```tsx
import { SkeletonText } from "@stealthscale/component-feedback";

<SkeletonText />;
<SkeletonText lines={5} motion="shimmer" />;
```

The last bar of several is short, because a paragraph rarely fills its final line and a block of
bars all one width reads as a table rather than as writing. `lines` defaults to three and never
draws fewer than one. Draw this while the text is loading and draw the text itself once it arrives,
so nothing here takes a loading state.

## EmptyState

Draws the panel a page shows where there is nothing to show, composed as `EmptyState.Root` holding a
mark, a heading and a line saying what would be here.

```tsx
import { EmptyState } from "@stealthscale/component-feedback";

<EmptyState.Root size="lg">
  <EmptyState.Content>
    <EmptyState.Indicator aria-hidden>
      <InboxIcon />
    </EmptyState.Indicator>
    <EmptyState.Title>No invoices yet</EmptyState.Title>
    <EmptyState.Description>Send your first one to get started.</EmptyState.Description>
  </EmptyState.Content>
</EmptyState.Root>;
```

| Axis   | Values                                            | Default |
| ------ | ------------------------------------------------- | ------- |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |

One axis sets four parts together. The room inside the panel, the gap in the content, the box of the
mark and the size of the title each read the scale of that name, so a small panel in a sidebar and a
large one filling a page are one name apart. The description holds its size, because a line of
explanation is read at the size the rest of the page is read at however big the panel is.

The mark fills whatever box its size states, so a caller passes a glyph without sizing it. Hide it
with `aria-hidden`, since the title beneath says the same thing in words. The title is an `h2`,
which suits a panel standing in for a section's content. A page whose outline puts it deeper states
its own level with `as`.

The root carries no role. A page of empty panels would otherwise be a page of landmarks.

## Licence

MIT. See [LICENSE](LICENSE).
