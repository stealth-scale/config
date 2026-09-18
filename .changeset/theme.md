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
- A control reads as pressed. `interactive` scales the box to 98 percent, held still for a reader
  who asked for reduced motion. A fill presses to the palette's `emphasized`, a solid fill to the
  ink it hovers to, and a plain one to the palette's solid. An outline fills in as it is hovered and
  further as it is pressed, rather than changing its line, which is the change a hover already
  makes.
- An outline and a surface clip their background to the padding box, so a rounded corner is drawn as
  one antialiased curve. A fill running under the line laid a second curve over the first, and the
  corners read heavier than the edges they joined.
- `controlSizes` leads with one step less inset where a mark opens the control, and `touchTarget`
  draws its area before the control's content rather than after it, which leaves the other
  pseudo-element to a look that draws one.
- The vocabulary a recipe writes its axes from is stated once: `SCALE`, `WIDTHS`, `RATIOS`,
  `CORNERS`, `COUNTS`, `TONES`, `WEIGHTS`, `MOTIONS`, `LIFTED`, `ALIGNMENTS`, `DISTRIBUTIONS` and
  `ROLE_SIZES`, with a helper that writes each axis from it: `gapSizes`, `alignVariants`,
  `justifyVariants`, `columnCounts`, `spanCounts`, `fittedColumns`, `widthSizes`, `ratioVariants`,
  `cornerVariants`, `textSizes`, `toneVariants`, `weightVariants`, `truncate`, `motionVariants` and
  `liftVariants`. Each takes the whole scale where a recipe names no part of it, so no recipe writes
  a scale out and a scale that gains a step needs no edit to a recipe. `onSlot` lifts an axis onto
  one part of a slot recipe.
- The per-slot pruning drops a class from a slot only where no value that styles the slot writes it.
  A grid drawing three columns and an entry spanning three write the same class on their own slots,
  and the root lost its columns to the entry's span.
- The semantic sizes state `tag`, the height of something read beside a control rather than pressed:
  a badge, a chip or a pill. It grows on the control's own shares from a base of half the height, so
  a theme that stretches its controls stretches the tags beside them by the same amount.
- `flatVariants` writes a `variant` axis that holds still, reading the `flat` layer styles: a look
  with a background and an ink and nothing a pointer changes. A badge drawn in a fill repaints
  whenever a pointer crosses it, which reads as a control a reader can press and then cannot. There
  is no flat ghost, because a look that never repaints is identical to plain.
- `tagSizes` writes the `size` axis of a tag, its height on the tag scale and its inset, its gap and
  its label one step down, and `below` reads the step under the one it is given so a recipe drawing
  something lighter than a control states no order of its own.
- The animation styles state `pulse`, which loops the keyframe of that name. The keyframe was
  already there and nothing named it, so a recipe that wanted a pulse wrote its own animation.
- `insetSizes` writes the `size` axis of a padded box, the room inside it on the inset scale. A
  control reads `controlSizes`, which sets a height and pads the sides alone, and a panel, a well or
  an empty state needs every side padded and no height.
- `onSlots` lifts one axis onto several parts at once, each part reading its own scale. A size axis
  moving four parts together is otherwise one object per step holding one entry per part, which is
  the shape a recipe author should never have to type.
- `row` writes the base of a row in a list the reader chooses from: a full-width line holding a
  mark, a label and a hint side by side. It carries no focus ring and no press, because such a list
  keeps focus on the container and moves a highlight over its rows, and it draws the arrow pointer
  rather than the hand, which is what the menu pattern asks for.
- `highlightVariants` writes the `highlight` axis of a list: `tint`, `fill` and `bar`, each a layer
  style under the highlighted condition. `bar` draws a line down the leading edge and tints the row
  behind it, so the row the reader is on is marked twice over. A menu, a select and a combobox all
  mark one row the same three ways, so a theme moves all of them by moving the layer styles.
