---
"@stealthscale/component-typography": minor
---

component-typography: publish Em and Strong

- `Em` marks a run of words the writer stressed. The element is `em` and it exposes the `emphasis`
  role. The recipe declares `fontStyle: italic` rather than relying on the browser's default, so a
  theme has a declaration to extend and a font family with no italic face has an explicit
  substitute.
- `Strong` marks a run of words as more important than the words around it. The element is `strong`
  and it exposes the `strong` role. The recipe declares a step of the weight scale. The browser's
  `bolder` keyword resolves against the inherited weight and reaches a different step in each
  context.
- Neither offers a variant axis. A theme changes how stress or importance is drawn by extending the
  recipe.
- Set `as="i"` or `as="b"` for a run drawn in italic or heavy for another reason. Those elements
  state no stress and no importance.
