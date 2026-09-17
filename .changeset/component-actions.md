---
"@stealthscale/component-actions": minor
---

component-actions: publish the button and the icon button

- `Button` binds a `button` element through the compiler's factory with `type` defaulted to
  `button`, so a caller changes the element with `as`. `ButtonPropsProvider` sets the variants of
  every button below it.
- The recipe offers the six looks and a glass look, the eight control sizes up to a hero's `4xl`,
  the four statuses, a square shape and the glow effect, each a layer style, a semantic scale step
  or a palette a theme moves.
- A button takes an `elevation`, `raised` or `floating`, which lifts under a pointer and drops
  towards the page under a press, and a `ripple` beside the `glow`.
- `IconButton` binds the same recipe with the square shape as its default, and its props require
  `aria-label` or `aria-labelledby`. A compound clears the inset a leading mark takes off it, so a
  square button holding one mark keeps the mark centred.
- The preset under `./theme` registers the recipe.
