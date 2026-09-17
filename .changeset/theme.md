---
"@stealthscale/theme": minor
---

theme: keep no value's class on a slot for a compound

- A slot carries the variant classes of the values that style it, and no other. A compound keeps no
  value's class on the slot it styles, because the compiler emits its styles under the compound's
  own class, which the runtime writes where the selection matches. A small outline card with a
  compound on its content carried `card__content--outline` with no rule behind it.
- `withContext` on a recipe binding takes a variant among its default props, so a component fixes
  one of the recipe's values: `withContext("button", { defaultProps: { shape: "square" } })`.
- The semantic spacing states `marker`, the gutter a list leaves for the browser's marker, at two
  and a half ems, which is the gutter every browser leaves by default. A recipe writes
  `paddingInlineStart: "marker"`, and a theme moves it.
