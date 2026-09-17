---
"@stealthscale/testing-theme": minor
---

testing-theme: find a part by its slot class and a recipe file by its directory

- `slotElement` and `slotClasses` take the recipe's name beside the slot's and find the part by its
  slot class, `card__header`, or by the part an anatomy stamps. The slot binding no longer writes
  `data-slot`, which the slot class already said.
- `recipeFiles` lists a file named `recipe.ts` under its directory's name, so `button/recipe.ts`
  registers as `button` beside `button.recipe.ts`.
