---
"@stealthscale/component-forms": minor
---

component-forms: publish the text field and the search field

- `Input` draws a box a person types one line into. The surface, the edge, the ink, the placeholder,
  the focus ring and every state a field enters come from the theme's own field fragment, so a theme
  decides what a field looks like once for every field. It offers a size read off the control scale,
  so a field lines up with a button of the same size beside it, and three looks for its edge.
- The field carries no label of its own and takes no prop for being wrong. A caller points a `label`
  at it or states `aria-label`, and a field that is wrong states `aria-invalid`, which is the
  attribute the recipe's invalid styling reads and the one a screen reader reads too. That is one
  attribute rather than two things able to disagree.
- The focus ring is drawn inside the box, because a ring outside it is clipped where a field sits
  flush against the edge of a panel.
- `SearchInput` draws a field a person searches from, with a control at its end that empties it. It
  takes `value` and `defaultValue`, so one component serves a caller that sets the value and a
  caller that leaves the component to hold it.
- The control appears only where the field holds something and a caller has passed something to draw
  in it, because a control that does nothing half the time is one a reader learns to pass over.
  Clearing puts focus back in the field.
- The field reserves room at its end exactly the width of the control, both read off the control
  scale, so one name moves both and the typing never runs underneath.
- The search field composes the text field rather than restating it, so a theme that moves every
  field moves this one and neither recipe repeats the other.
