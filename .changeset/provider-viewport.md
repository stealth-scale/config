---
"@stealthscale/provider-viewport": minor
---

provider-viewport: publish widthOf

- `widthOf(breakpoint)` reads the width a breakpoint starts at, in pixels, so a component measuring
  its own element compares against the vocabulary rather than against a number a caller invented.
  Every screen component now folds at `useNarrow(ref, widthOf("md"), "md")`.
- It answers a number rather than a condition, and the README says so. A component that reads it
  measures its own element and folds on that. A component that wants the window folds on a style
  prop or a media query, which is what the breakpoints are for.
