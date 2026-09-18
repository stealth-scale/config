---
"@stealthscale/theme": minor
---

theme: add role tables for a ramp keyed by its own steps

- `paletteRoles(ramp, steps, darkRamp)` takes a table naming a step for each role in each mode, or a
  color stated outright, and reads the dark steps from a second ramp where a theme draws one.
  `ROLE_STEPS` is the foundation's own table.
- `foregrounds(ramp, steps, darkRamp)` and `borders(ramp, steps, darkRamp)` take a table the same
  way, with `FOREGROUND_STEPS` and `BORDER_STEPS` as the foundation's.
- `surfaces(ramp, steps, darkRamp)` draws the `bg` family from steps of a neutral ramp, for a theme
  whose surfaces sit on its own scale rather than at a distance from the page.
- `ramp(keys, values)` keys a transcribed ramp by its own step names, and
  `stepped(ramp, light, dark, darkRamp)` writes one color as a reference into a step in each mode.
- `contrast()` and `luminance()` read an OKLCH color whose hue is `none`.
- `linear(color)` converts a color to linear sRGB and `oklab(color)` to OKLab, unclamped, for a
  check that measures a distance rather than a ratio.
- `Application.themes` is optional. An application that states no theme draws the foundation alone.
- A bound element carries `data-recipe` only where `process.env.NODE_ENV` is not `production`, so a
  production page carries no attribute the testing kit alone reads.
