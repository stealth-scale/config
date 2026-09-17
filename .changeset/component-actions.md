---
"@stealthscale/component-actions": minor
---

component-actions: publish the button and the icon button

- `Button` binds a `button` element through the compiler's factory with `type` defaulted to
  `button`, so a caller changes the element with `as`. `ButtonPropsProvider` sets the variants of
  every button below it.
- The recipe offers the six looks and a glass look, the five control sizes, the four statuses, a
  square shape and the glow effect, each a layer style, a semantic scale step or a palette a theme
  moves.
- `IconButton` binds the same recipe with the square shape as its default, and its props require
  `aria-label` or `aria-labelledby`.
- The preset under `./theme` registers the recipe.
