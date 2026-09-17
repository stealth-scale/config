---
"@stealthscale/testing-react": minor
---

testing-react: check that a component honours as

- `violations` takes an `as` option beside `asChild`. It renders the component with `as: "a"` and
  reports `does not honour as` where the element read back is not an anchor, which is what a
  component bound through the compiler's factory owes a caller who changes its element.
