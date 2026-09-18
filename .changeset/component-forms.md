---
"@stealthscale/component-forms": minor
---

component-forms: publish InputGroup

- `InputGroup` draws a field with a mark at one end or both: a currency symbol, a unit, a glyph, or
  a control. Four parts under one namespace: `Root`, `Field`, `Start` and `End`.
- The marks are drawn over the field and the field reserves room for them, so the typing never runs
  underneath. The room is one custom property. `size` writes it on the root as the control height of
  that step, and `marks` reads it on the side a mark sits, which is one axis pair rather than a
  compound for every size and side.
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
