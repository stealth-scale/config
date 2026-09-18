# @stealthscale/component-forms

Draws what a person fills in: the field that explains a control, the text field, the field with a
mark at one end or both, and the search field with a control that empties it. Every component binds
a recipe and draws nothing of its own, so a theme restyles all of them by extending the recipe. The
preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`. A component with
parts is published as a namespace, `Field.Root` and `InputGroup.Root`.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. An application lists
the preset under `./theme` among the presets its compiler installs.

## Field

Wraps a control in everything that explains it: a label, the text a person needs in advance, a
count, and what went wrong. Every control composes into a field, so a form states each of its
conditions once.

```tsx
import { Field } from "@stealthscale/component-forms";

<Field.Root invalid={!valid} required>
  <Field.Label>
    Email
    <Field.RequiredIndicator />
  </Field.Label>
  <Field.Control type="email" />
  <Field.HelperText>We only write about invoices.</Field.HelperText>
  <Field.ErrorText>That address is not one we recognise.</Field.ErrorText>
</Field.Root>;
```

| Axis          | Values                                | Default    |
| ------------- | ------------------------------------- | ---------- |
| `size`        | `sm`, `md`, `lg`                      | `md`       |
| `orientation` | `vertical`, `horizontal`              | `vertical` |
| `status`      | `info`, `success`, `warning`, `error` | `error`    |

`Field.Root` also takes `disabled`, `invalid`, `readOnly` and `required`, which every part reads.
One `invalid` marks the control, draws the message and leaves the two in step, where a prop on each
part would let them disagree.

### The parts

| Part                | Element | What it draws                               |
| ------------------- | ------- | ------------------------------------------- |
| `Root`              | `div`   | The box, and the state every part reads     |
| `Label`             | `label` | The words naming the control                |
| `RequiredIndicator` | `span`  | A mark, where the field has to be filled in |
| `Control`           | `input` | What a person fills in                      |
| `HelperText`        | `p`     | What a person needs to know in advance      |
| `Counter`           | `p`     | How much of an allowance is used            |
| `ErrorText`         | `p`     | What went wrong, where the field is wrong   |

### What the field wires

The root derives four identifiers from one. State `id` where a label outside the field points at the
control; React generates one otherwise.

- The label points at the control with `htmlFor`, which is what makes its words the control's name
  and what moves focus on a press.
- The control is described by the helper text and the message. Both identifiers are listed whether
  or not either is drawn, because an identifier naming no element is passed over. Watching the
  document to find out which exists would mean writing state from an effect, which React 19 reports,
  and a second render before the control is described at all.
- The control takes `aria-invalid`, `disabled`, `readOnly` and `required` from the root. A prop a
  caller states on the control wins.

`Field.Control` binds the text field. Another control goes in its place with `as`.

### The message

`Field.ErrorText` renders nothing where the field is not wrong, so a screen reader moving through
the form never reaches a message about a fault that is not there.

It states `role="alert"`, so a message raised after a person submits reaches a reader who is not
looking at the field. The region is mounted with the message in it rather than before it, which some
screen readers announce late. The alternative is an empty live region on every field of the form,
read on the way past whether or not it holds anything.

Its ink is the palette's, which `status` sets. A field reporting something other than a fault states
that status once on the root, and the same part draws a green message.

### The required mark

`Field.RequiredIndicator` renders nothing where the field is optional, and states `aria-hidden`
where it does. The control already states `required`, which is what a reader is told, and a mark
read aloud would repeat it as a glyph.

The mark carries no meaning on its own. A form where most fields are required states that above the
form and marks the optional ones in words instead.

### The counter

`Field.Counter` announces politely and stays out of `aria-describedby`. A description is read when
the control takes focus, and a number that changes as a person types would be read stale.

It draws the count a caller passes and measures nothing. What counts as a character differs by
field: an emoji is two UTF-16 units and one grapheme, and a server that truncates at 140 may mean
either.

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
