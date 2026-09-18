---
"@stealthscale/theme-graphite": minor
---

theme-graphite: add the theme with its dimmed and high-contrast variants

- A developer's product on cool greys with a blue accent, a green call to action and Mona Sans.
- `graphite-dimmed` redraws the dark ramps for a softer dark page, and `graphite-contrast` redraws
  every ramp in both modes.
- Every ramp is written in OKLCH and keyed by its own steps, and every role sits on a step of its
  ramp. The theme's specification runs it through `violations` at 4.5:1 for text and 3:1 for lines
  and rings, in both modes.
