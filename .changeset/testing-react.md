---
"@stealthscale/testing-react": minor
---

testing-react: check that a component honours as

- `violations` takes an `as` option beside `asChild`. It renders the component with `as: "a"` and
  reports `does not honour as` where the element read back is not an anchor, which is what a
  component bound through the compiler's factory owes a caller who changes its element.
- `accessibilityViolations` renders a component under the same `props` and `wrapper`, runs axe over
  it, and returns each rule it breaks as `id: help`. The kit depends on `axe-core` for it.
