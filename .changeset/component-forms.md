---
"@stealthscale/component-forms": minor
---

component-forms: read the field looks off the theme and add a status axis to Input

- `Input` reads `fieldVariants()` for its `variant` axis. It offers `outline`, `subtle` and
  `flushed` as before, each now a layer style in `layerStyles.field` rather than a colour the recipe
  wrote.
- `Input` takes a `status` of `info`, `success`, `warning` or `error`, which points the palette at
  that status and draws the edge in the line family's member of the same name.
- The flushed look keeps `paddingInline: "0"` in the recipe, because a layer style holds no padding.
  Its text starts at the box's own edge rather than at the `inset.<size>` an outline field carries,
  so a column holding both looks does not align.
