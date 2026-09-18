---
"@stealthscale/component-data": minor
---

component-data: publish the badge

- `Badge` labels something with one short word or a count, set off from what it labels. It takes a
  look, a size, a status and a corner, each an axis of its recipe, and `BadgePropsProvider` sets
  them for every badge below it.
- Each look writes a background and an ink and nothing a pointer changes. A badge inside a row that
  hovers is crossed by the pointer whenever the row is, and one drawn in a fill would repaint there,
  which reads as a control a reader can press and then cannot.
- The sizes read the semantic tag scale, so a badge is half the height of the control of its own
  size and its inset, its gap and its label come one step down. A medium badge beside a medium
  button reads at the small label.
- The element is `span` and carries no role, so a screen reader reads its text and nothing else. A
  badge whose meaning is in its colour states that meaning with `aria-label`.
