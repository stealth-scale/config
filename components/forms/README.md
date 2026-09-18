# @stealthscale/component-forms

Draws what a person fills in: the group, the field that explains a control, the text field, the
field with a mark at one end or both, and the search field with a control that empties it.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component draws with `as`. A component with parts is published as a
namespace, `Field.Root` and `InputGroup.Root`.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. List the preset under
`./theme` among the presets your compiler installs.

## Fieldset

Groups fields that belong together and names the group.

```tsx
import { Field, Fieldset } from "@stealthscale/component-forms";

<Fieldset.Root disabled={!editable} orientation="horizontal">
  <Fieldset.Legend>Delivery</Fieldset.Legend>
  <Fieldset.HelperText>We deliver on weekdays.</Fieldset.HelperText>
  <Field.Root>
    <Field.Label>Address</Field.Label>
    <Field.Control />
  </Field.Root>
  <Fieldset.ErrorText>Choose one before going on.</Fieldset.ErrorText>
</Fieldset.Root>;
```

| Axis          | Values                                | Default    |
| ------------- | ------------------------------------- | ---------- |
| `size`        | `sm`, `md`, `lg`                      | `md`       |
| `orientation` | `vertical`, `horizontal`              | `vertical` |
| `status`      | `info`, `success`, `warning`, `error` | `error`    |

| Part         | Element    | What it draws                          |
| ------------ | ---------- | -------------------------------------- |
| `Root`       | `fieldset` | The group, and the state it hands down |
| `Legend`     | `legend`   | The words naming the group             |
| `HelperText` | `p`        | What a person needs to know            |
| `ErrorText`  | `p`        | What went wrong with the group         |

`Fieldset.Root` also takes `disabled` and `invalid`.

Write the legend first. A browser takes the first `legend` as the group's name and reads a later one
as ordinary content.

`disabled` takes every control in the group out of reach, out of the tab order and out of what the
form submits. It leaves the legend alone. Fields inside inherit the state and draw their labels as
unreachable. State `disabled` on a field to override it.

Use `Fieldset.ErrorText` for a fault belonging to the group, such as a set of options none of which
was chosen or two dates in the wrong order. A fault belonging to one field goes in that field's
message.

## Field

Wraps a control in everything that explains it: a label, the text a person needs in advance, a count
and what went wrong.

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

| Part                | Element | What it draws                               |
| ------------------- | ------- | ------------------------------------------- |
| `Root`              | `div`   | The box, and the state every part reads     |
| `Label`             | `label` | The words naming the control                |
| `RequiredIndicator` | `span`  | A mark, where the field has to be filled in |
| `Control`           | `input` | What a person fills in                      |
| `HelperText`        | `p`     | What a person needs to know in advance      |
| `Counter`           | `p`     | How much of an allowance is used            |
| `ErrorText`         | `p`     | What went wrong, where the field is wrong   |

`Field.Root` also takes `disabled`, `invalid`, `readOnly` and `required`. Every part reads them, so
state each condition once.

State `id` on the root where a label outside the field points at the control. The field derives the
other identifiers from it and generates one where you state none.

`Field.Control` binds the text field. Put another control in its place with `as`. A prop you state
on the control overrides the field's.

`Field.ErrorText` draws nothing where the field is not wrong, and states `role="alert"` where it is.
`Field.RequiredIndicator` draws nothing where the field is optional. Both read the palette `status`
sets, which defaults to the error one.

`Field.Counter` draws the count you pass and measures nothing.

## Input

Draws a box a person types one line into.

```tsx
import { Input } from "@stealthscale/component-forms";

<Input aria-label="Search invoices" size="sm" variant="subtle" />;
<Input aria-invalid placeholder="name@example.com" />;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |
| `status`  | `info`, `success`, `warning`, `error`             | none      |

The size reads the control scale, so a field lines up with a button of the same size beside it.

Name the field. Compose it into `Field`, point a `label` at it, or state `aria-label`. A field with
none of those is announced as `edit text` and nothing more.

State `aria-invalid` on a field that is wrong. There is no separate prop, so the styling and what a
screen reader reads cannot disagree.

## InputGroup

Draws a field with a mark at one end or both: a currency symbol, a unit, a glyph, or a control.

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

| Part    | Element | What it draws                     |
| ------- | ------- | --------------------------------- |
| `Root`  | `div`   | The box, and the variants         |
| `Field` | `input` | The control the marks sit against |
| `Start` | `div`   | A mark at the start of the field  |
| `End`   | `div`   | A mark at the end of the field    |

Set `marks` to the side you draw a mark on. The field reserves room there, so the typing never runs
underneath.

`InputGroup.Field` binds the text field. Put another control in its place with `as`, and any control
built on the theme's control sizes takes the room the group reserves:

```tsx
<InputGroup.Field as={Select.Trigger} />
```

A native `select` takes a start mark and not an end one. The browser draws its own arrow at the
inline end.

Set `align="start"` for a control that runs to several lines.

Label a mark that carries meaning. State `aria-hidden` on a decorative one. A press over a mark
reaches the field behind it, and a control drawn in a mark still works.

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

Takes `value` and `defaultValue`, so it serves a caller that holds the value and one that does not.
`onValueChange` reports the contents on every change.

The control appears where the field holds something and you have passed something to draw in it.
Clearing puts focus back in the field. Name the control with `clearLabel`, which defaults to
`Clear search`.

## Licence

MIT. See [LICENSE](LICENSE).
