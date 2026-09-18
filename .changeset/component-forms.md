---
"@stealthscale/component-forms": minor
---

component-forms: publish Fieldset, Field, Textarea and InputGroup

- `Textarea` draws a box a person types several lines into. Set `grows` and it takes its height from
  the text, measuring nothing: the root is a grid of one cell holding both the control and a hidden
  copy of its text, and the copy gives the cell its height. The box is right on the frame the text
  changes, and no layout is read and no state is written from an effect.
- Five axes: `size`, `variant`, `status`, `grip` and `grows`. `grip` is the CSS `resize` property,
  named apart from it because a styled element takes every CSS property as a prop and a style prop
  of the same name shadows an axis.
- It takes `value` and `defaultValue`, and reports every change through `onValueChange`. Compose it
  into a field with `<Field.Control as={Textarea} />`.

- `Fieldset` groups fields that belong together and names the group. Four parts under one namespace:
  `Root`, `Legend`, `HelperText` and `ErrorText`.
- `Fieldset.Root` is a `fieldset` and `disabled` is the element's own attribute, so a browser takes
  every control in the group out of reach, out of the tab order and out of what the form submits,
  and leaves the first legend alone. The state also goes down a context, so the labels beside those
  controls draw as unreachable. A field states its own `disabled` to override it.
- The root is described by both of its texts and carries `aria-invalid`. It clears the minimum
  inline size a `fieldset` defaults to, so one inside a flex or grid parent shrinks.
- Three axes: `size`, `orientation` and `status`.

- `Field` wraps a control in everything that explains it. Seven parts under one namespace: `Root`,
  `Label`, `RequiredIndicator`, `Control`, `HelperText`, `Counter` and `ErrorText`.
- `Field.Root` takes `disabled`, `invalid`, `readOnly` and `required`, and every part reads them.
  One `invalid` marks the control, draws the message and leaves the two in step, where a prop on
  each part would let them disagree.
- The root derives four identifiers from one. The label points at the control with `htmlFor`, and
  the control is described by the helper text and the message. Both identifiers are listed whether
  or not either is drawn, because an identifier naming no element is passed over. Watching the
  document to find out which exists would mean writing state from an effect, which React 19 reports,
  and a second render before the control is described at all.
- `ErrorText` renders nothing where the field is not wrong, and states `role="alert"` where it does,
  so a message raised after a submit reaches a reader who is not looking at the field.
- `RequiredIndicator` renders nothing where the field is optional and states `aria-hidden` where it
  does, since the control already carries `required`.
- `Counter` announces politely and stays out of `aria-describedby`. A description is read when the
  control takes focus, and a number that changes as a person types would be read stale.
- The message and the required mark read the palette, which `status` sets. A field defaults to the
  error palette, so the same part draws a green message for a field reporting something else.
- Three axes: `size`, `orientation` and `status`.

- `InputGroup` draws a field with a mark at one end or both: a currency symbol, a unit, a glyph, or
  a control. Four parts under one namespace: `Root`, `Field`, `Start` and `End`.
- The marks are drawn over the field and the field reserves room for them, so the typing never runs
  underneath. The group writes no padding: `size` states the room on the root and `marks` hands it
  to `--control-inset-start` or `--control-inset-end`, which every recipe built on `controlSizes`
  reads with its own step as the fallback. The control's recipe stays the one rule writing its
  padding, so restyling the control never races the group for the property.
- `SearchInput` is drawn on the group with `marks="end"`, so the two write one mechanism between
  them. Its own recipe is now the control that empties the field and nothing else.
- `marks` takes `start`, `end` or `both`, defaulting to `both`. `size` reads the control scale, so a
  mark and the field step together and a group lines up with a button beside it.
- `InputGroup.Field` binds the text field, so a group holding one needs no `as`. Another control
  goes in its place with `as`, and the factory draws it under both recipes. A native `select` is the
  one control this does not hold at both ends, because the browser draws and places its own arrow at
  the inline end.
- `align` takes `center` or `start`, defaulting to `center`. Set `start` for a control that runs to
  several lines, where a mark centred against a tall box floats in the middle of it.
- A mark takes no pointer and whatever it holds takes the pointer back, so a press over a decorative
  glyph reaches the field behind it and a control drawn in a mark still works.
- `Input` gains a `status` row in the README, which the axis it took in the previous release left
  undocumented.
