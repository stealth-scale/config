---
"@stealthscale/theme": minor
---

theme: publish the field looks as layer styles and open a control's insets

- `layerStyles.field` names `outline` on `bg.panel`, `subtle` on `bg.muted`, and `flushed` with its
  bottom edge alone. A field recipe wrote those colours itself before this, so a theme that restated
  `fill.subtle` moved every control but a field.
- `fieldVariants()` writes the `variant` axis from those layer styles, beside `lookVariants()` and
  `flatVariants()`. It takes the looks a recipe names, or offers all three.
- `fieldStatusVariants()` writes the `status` axis of a field: the palette of the status, and the
  edge in the line family's member of the same name. It draws `border.error` for the error status,
  which is the token `field()`'s `_invalid` already draws, so the axis and the attribute agree.
- `field()` sets `minBlockSize` to `control.md` under `_touch`. A field is a replaced element and no
  pseudo-element renders on one, so the coarse-pointer target is the height rather than the box
  `touchTarget()` grows.
- `field()` sets the same `transitionProperty`, `transitionDuration` and `transitionTimingFunction`
  as `interactive()`, so a field and a button in one row settle together rather than one snapping.
- `controlSizes()` writes each inline inset through a custom property with the step as the fallback:
  `paddingInlineStart: var(--control-inset-start, {spacing.inset.<size>})`, and the same for the
  end. `CONTROL_INSET_START` and `CONTROL_INSET_END` name the two.
- A component that places something inside a control opens the side it needs by setting a property
  rather than by writing padding of its own. The control's own recipe stays the one rule writing its
  padding, so the two never race for the property and a theme that restyles the control keeps the
  room. Every recipe reading `controlSizes()` is groupable through this.
- Nothing moves for a control outside such a component. The property is unset and the fallback is
  the step the helper wrote before.

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
