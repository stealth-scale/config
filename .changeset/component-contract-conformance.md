---
"@stealthscale/testing-react": minor
---

Read the component contract a wrapper breaks

- add `violations(Component, options)`: mounts once per check, answers what it does not keep
- always: renders an element, merges `className` without dropping its own, forwards `ref`, spreads
  props it does not name
- on request: `element` names the tag, `children`, `asChild` — none of them every component's
- violations rather than a verdict, so nothing here asserts and the package needs no test runner
