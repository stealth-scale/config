---
"@stealthscale/specimen": minor
---

add what a specimen is written with

- `specimen()` and `scene()` declare a page and the things drawn on it. The index plugin parses the
  call out of the source and never evaluates it.
- `Matrix` draws one captioned cell per value of an axis, with `of`, `knob` and `label` describing
  the axis and `direction` the arrangement.
- Draw the arrangement as `Stack` and the caption as `Text`, so the package states no recipe and
  registers no preset.
- Write both arrangements out rather than forwarding `direction` to one stack, because the compiler
  extracts a JSX literal and not a value read from a prop.

27 tests, 100% on all four metrics.
