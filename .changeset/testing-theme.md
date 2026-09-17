---
"@stealthscale/testing-theme": minor
---

testing-theme: add the theme testing kit

- `violations(theme, options)` checks a theme against the contract and the contrast table: every
  role and every mode, every reference, every extension and its compounds, every text pair at 7:1
  and every line and ring at 3:1.
- `recipeViolations(recipe, options)` reports a color a theme cannot move, a token or a condition
  the preset does not define, a length in px, rem or pt, a color mode, a slot the anatomy does not
  stamp, and `fg.subtle` as a text color.
- `presetViolations(preset, options)` reports a recipe file the preset does not register, a key that
  is not the class name in camel case, and a slot recipe under the wrong section.
- The readers list the classes a recipe emits, read what a recipe declares, read what a rendered
  component drew, and resolve a theme's colors through every reference.
- `slotElement` and `slotClasses` find a part by the `data-slot` a slot binding stamps as well as by
  the `data-part` an anatomy stamps, so a compound component with no machine behind it is read the
  same way.
