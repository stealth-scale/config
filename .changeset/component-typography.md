---
"@stealthscale/component-typography": minor
---

component-typography: publish the first seven components

- `Text`, `Heading`, `Code`, `Kbd` and `Icon` each bind one element through the compiler's factory,
  so a caller changes the element with `as`. `List` and `Blockquote` are published as namespaces of
  their parts, `List.Root` and `Blockquote.Content`.
- Every axis the vocabulary lets a theme move on a component is an axis of its recipe: the body and
  heading roles as sizes, the foreground roles as tones, the looks, the statuses, the semantic
  scales, and the text effects, masks and motions as `effect`, `mask` and `motion`.
- `Icon` states the `img` role, so a label a caller gives it names the graphic in every screen
  reader. `List.Indicator` is hidden from assistive technology, as the browser's bullet is.
- `List` takes a `marker`: the three bullets, a dash, decimal with or without a leading zero, roman
  and alphabetic numbering in both cases, and greek letters. The element's own marker stays until a
  caller picks one.
- The sizes run on the foundation's full scale where a component has a use for the step: `Heading`
  and `Icon` from `xs` to `4xl`, `Text` from `xs` to `xl`, and `List` gaps to `4xl`.
- `Icon` fills its artwork in the current colour, so a path with no fill of its own follows the ink
  into dark mode rather than staying black.
- The preset under `./theme` registers all seven recipes.
