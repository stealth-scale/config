# @stealthscale/component-forms

Draws what a person fills in: the text field, the field with a mark at one end or both, and the
search field with a control that empties it. Every component binds a recipe and draws nothing of its
own, so a theme restyles all of them by extending the recipe. The preset under `./theme` registers
the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `InputGroup.Root`.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. An application lists
the preset under `./theme` among the presets its compiler installs.

## Input

Draws a box a person types one line into. The surface, the edge, the ink, the placeholder, the focus
ring and every state a field enters come from the theme, so a theme decides what a field looks like
once for every field. The size reads the control scale, so a field lines up with a button of the
same size beside it.

```tsx
import { Input } from "@stealthscale/component-forms";

<label htmlFor="email">Email</label>
<Input id="email" type="email" />;
<Input aria-label="Search invoices" size="sm" variant="subtle" />;
<Input aria-invalid placeholder="name@example.com" />;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |

The field carries no label of its own. Point a `label` at it, or state `aria-label` where the page
has drawn the name elsewhere. A field with neither is announced as `edit text` and nothing more.

A field that is wrong states `aria-invalid`, which is the attribute the recipe's invalid styling
reads and the one a screen reader reads too. There is no separate prop for it, so the two cannot
disagree.

The focus ring is drawn inside the box, because a ring outside it is clipped where a field sits
flush against the edge of a panel.

## InputGroup

Draws a field with a mark at one end or both: a currency symbol, a unit, a glyph, or a control. The
marks are drawn over the field and the field reserves room for them, so the typing never runs
underneath.

```tsx
import { InputGroup } from "@stealthscale/component-forms";

<InputGroup.Root marks="start">
  <InputGroup.Start aria-hidden>€</InputGroup.Start>
  <InputGroup.Field aria-label="Amount" inputMode="decimal" />
</InputGroup.Root>;
```

| Axis    | Values                                            | Default  |
| ------- | ------------------------------------------------- | -------- |
| `size`  | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`     |
| `marks` | `start`, `end`, `both`                            | `both`   |
| `align` | `center`, `start`                                 | `center` |

`marks` states which ends reserve room. State the side you draw a mark on, or leave it at `both` for
a field marked at either end.

The group writes no padding. `size` states the room a mark takes on the root, and `marks` hands it
to `--control-inset-start` or `--control-inset-end`, which every recipe built on `controlSizes`
reads with its own step as the fallback. The control's recipe stays the one rule writing its
padding, so restyling the control never races the group for the property, and any control reading
that helper can go in the field.

`InputGroup.Field` binds the text field, so a group holding one needs no `as`. Another control goes
in its place with `as`, and the factory draws it under both recipes:

```tsx
<InputGroup.Field as={Select.Trigger} />
```

A native `select` is the one control this does not hold at both ends. The browser draws its own
arrow at the inline end and places it itself, so an end mark lands on top of one.

Set `align="start"` for a control that runs to several lines. A mark centred against a tall box
floats in the middle of it.

A mark takes no pointer, so a press over one reaches the field behind it, and whatever the mark
holds takes the pointer back. A mark that carries meaning is labelled by the caller. A decorative
one states `aria-hidden`, which keeps a screen reader from reading a glyph before every field.

## SearchInput

Draws a field a person searches from, with a control at its end that empties it.

```tsx
import { SearchInput } from "@stealthscale/component-forms";

<SearchInput aria-label="Search invoices" clearIndicator={<CloseIcon />} />;
<SearchInput
  aria-label="Search"
  clearIndicator={<CloseIcon />}
  onValueChange={setQuery}
  size="sm"
  value={query}
/>;
```

| Axis   | Values                                            | Default |
| ------ | ------------------------------------------------- | ------- |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |

It takes `value` and `defaultValue`, so one component serves a caller that sets the value and a
caller that leaves the component to hold it. `onValueChange` is called with the contents each time
they change.

The control appears only where the field holds something and a caller has passed something to draw
in it. A control that is always there and does nothing half the time is one a reader learns to pass
over. Clearing puts focus back in the field, because a person who has just emptied a search is about
to type another one. Name the control with `clearLabel`, which defaults to `Clear search`.

The box, the field and the room the field leaves at its end are `InputGroup`'s, drawn with
`marks="end"`. This component adds the control alone, so the two write one mechanism between them
and a theme that moves every grouped field moves this one.

## Licence

MIT. See [LICENSE](LICENSE).
