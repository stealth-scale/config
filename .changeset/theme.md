---
"@stealthscale/theme": minor
---

theme: draw a variant's class on the slots the value styles alone, and a bare heading in its role

- A slot carries the variant classes of the values that style it, through their own styles or
  through a compound matched on them, and no other. The runtime hands every slot the whole variant
  map, so a card's content carried `card__content--lg` with no rule behind it: fifteen such classes
  on one card.
- A heading with no text style of its own reads in the heading role of its level, `heading.xl` for
  `h1` down to `heading.sm` for `h4` to `h6`, from the base layer. The compiler's reset had left it
  at the size and the weight of the text around it. A text style on the element still overrides the
  role.
