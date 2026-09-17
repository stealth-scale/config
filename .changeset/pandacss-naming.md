---
"@stealthscale/pandacss-naming": minor
---

pandacss-naming: write a value in lower kebab-case and drop a custom property's hyphens

- `atomicClass` writes the value of an atomic class in lower kebab-case, so `bg_colorPalette.solid`
  becomes `bg-color-palette-solid` and `ff_Segoe_UI` becomes `ff-segoe-ui`. A class name resolves no
  token, so its case is free, and one case reads as one scheme.
- The class of a custom property drops the hyphens the property opens with, so `--stagger_0` becomes
  `stagger-0`.
