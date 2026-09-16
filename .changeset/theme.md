---
"@stealthscale/theme": patch
---

theme: name every compound in its recipe and read the sizes from the tokens

- `defineRecipe` writes `className` on every compound from the axes it matches on, and
  `defineSlotRecipe` splits a compound into one per slot it styles, each named. The compiler emits a
  compound's styles under that class and the binding emits the same class at run time.
- `compoundClassName(className, compound)` publishes the scheme from `./authoring`.
- `typography()` writes each size as a reference to the `fontSizes` token of the same name.
- `slide-fade.out` leaves towards the side the anchor is on: `top` to `slide-to-bottom`.
- `Elevation` names the shadow step `surface()` takes. `Level` is the contrast level alone.
- `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` are defined once, in `attributes.ts`.
- `switcher()` reads its threshold against the size scale where it is a name, as `simpleGrid()`
  reads its narrowest column, and switches at `md` when nothing is stated.
