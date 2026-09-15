---
"@stealthscale/testing-react": minor
---

Check a component that cannot be rendered on its own

- `violations` takes `wrapper`, for whatever a component needs above it, and `subject`, for finding
  the element under test inside it. A compound's part needs both
- a component that throws is reported as throwing, with its message, rather than as rendering
  nothing: a part missing its provider throws, and the two are different bugs
