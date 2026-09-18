---
"@stealthscale/component-typography": minor
---

component-typography: publish Em, Strong and Mark

- `Em` marks a run of words the writer stressed. The element is `em` and it exposes the `emphasis`
  role. The recipe declares `fontStyle: italic` rather than relying on the browser's default, so a
  theme has a declaration to extend and a font family with no italic face has an explicit
  substitute. It offers `tone` and `motion`.
- `Strong` marks a run as more important than the words around it. The element is `strong` and it
  exposes the `strong` role. It offers `weight` at `medium`, `semibold` and `bold`, defaulting to
  `semibold`, beside `tone` and `motion`. The scale's `normal` step is left out, and the browser's
  `bolder` keyword is not read, because `bolder` resolves against the inherited weight and reaches a
  different step in each context.
- `Mark` picks a run out of the text around it. The element is `mark` and it exposes the `mark`
  role. It offers `variant` over the five flat looks plus `text`, `status`, `radius`, `inset`,
  `motion` and `effect`. `MarkPropsProvider` sets the variants of every mark below it.
- The mark's filled looks read the `flat` layer styles, whose background and ink are the palette
  pairs the contrast gate measures, so a highlight clears the text ratio in both color modes.
- The mark's base clones the box decoration, so a fill that runs onto a second line carries its
  inset and its corners onto both. The base sets no `whiteSpace`: a marked phrase held on one line
  forces a horizontal scroll at 320 pixels, which WCAG 1.4.10 fails.
- The mark's inset opens `paddingInline` alone. Block padding on an inline box overflows into the
  line above rather than opening the line.
- A compound named `tinted` draws the palette ink where a status meets `plain` or `text`, the two
  looks that write no fill and would otherwise take a status and show nothing.
