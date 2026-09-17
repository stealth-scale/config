---
"@stealthscale/testing-theme": minor
---

testing-theme: find a part by its slot class and a recipe file by its directory

- `slotElement` and `slotClasses` take the recipe's name beside the slot's and find the part by its
  slot class, `card__header`, or by the part an anatomy stamps. The slot binding no longer writes
  `data-slot`, which the slot class already said.
- `recipeFiles` lists a file named `recipe.ts` under its directory's name, so `button/recipe.ts`
  registers as `button` beside `button.recipe.ts`.
- `recipeViolations` reports four more things the runtime writes a class for and no rule reaches: a
  value or a compound that states no styles, a default naming a value the axis does not offer, a
  compound matched on such a value, and, with `names`, a `jsx` pattern that misses a name a consumer
  writes the component under.
- `violations` on a theme reports `contract.variants`: an extension styling an axis the recipe does
  not offer, a value the axis does not offer, or a part the recipe's value does not style.
  `contract.compounds` also reports a compound styling a part the recipe's compound does not.
- `boundViolations` renders a bound component once with nothing picked and once per value of every
  axis, and reports each class the element lacks and each class it has that the recipe does not
  write. A part named by `slot` gets a value's class only where the value styles that slot, and
  `defaults` names the values a binding fixes through its default props, each of which the recipe
  lists under `staticCss` or the check reports.
