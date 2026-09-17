---
"@stealthscale/theme": patch
---

theme: draw a variant's class on the slots the value styles alone

- A slot carries the variant classes of the values that style it, through their own styles or
  through a compound matched on them, and no other. The runtime hands every slot the whole variant
  map, so a card's content carried `card__content--lg` with no rule behind it: fifteen such classes
  on one card.
