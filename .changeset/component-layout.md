---
"@stealthscale/component-layout": minor
---

component-layout: publish Group

- `Group` lays controls along one direction, a semantic gap apart or attached into one control with
  several parts.
- `attached` squares the corners between neighbours and draws the border between them once, so three
  buttons read as one control with three parts. It also stops the group wrapping and closes the gap,
  because a row that wrapped would leave a squared corner at the end of a line and a gap would show
  the seam the squared corners are there to hide.
- Six axes: `align`, `attached`, `gap`, `grow`, `justify` and `orientation`.
- The element is a `div` and says nothing about what it holds. Name the set with `role="group"` and
  `aria-label` where the children are one choice, and use a fieldset where they are form controls.
