---
"@stealthscale/component-typography": minor
---

component-typography: publish Em

- `Em` marks the words a writer stressed. The element is `em`, which a screen reader reads with that
  stress and which carries the meaning to a reader who sees no italic.
- The recipe states `fontStyle: italic` rather than leaving it to the browser's default for the
  element, so a theme has something to extend and a face that ships no italic can be told what to
  draw instead.
- It offers no axis. A run set in italic for a reason other than stress reaches `i` through `as`.
