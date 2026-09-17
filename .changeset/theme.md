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
- Every geometry scale runs from `xs` to `4xl`: `control` reaches twice its base at `4xl`, `icon`
  three times, `inset` three times and `gap` six times, so a hero's call to action, the mark beside
  it and the room around it grow together on the same names. The `label` role follows to `4xl`,
  growing slower than the control, the `heading` role gains `xs`, `3xl` and `4xl`, and the `body`
  role gains `xs` and `xl`.
- The type scale gains `8xl` and `9xl`, and the heading role steps over two sizes above `2xl`: `3xl`
  reads at the `6xl` size and `4xl` at the `8xl`. A document heading and a hero heading are
  different things, and the size between them read as neither.
- A control reads as pressed. `interactive` squeezes the box to 98 percent, held still for a reader
  who asked for less motion. A fill presses to the palette's `emphasized`, a solid fill to the ink
  it hovers to, and a plain one to the palette's solid. An outline fills in as it is hovered and
  further as it is pressed, rather than changing its line, which is the change a hover already
  makes.
- An outline and a surface clip their background to the padding box, so a rounded corner is drawn as
  one antialiased curve. A fill running under the line laid a second curve over the first, and the
  corners read heavier than the edges they joined.
- `controlSizes` leads with one step less inset where a mark opens the control, and `touchTarget`
  draws its area before the control's content rather than after it, which leaves the other
  pseudo-element to a look that draws one.
