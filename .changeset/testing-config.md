---
"@stealthscale/testing-config": minor
---

testing-config: hold a package's barrels to a specification where it asks

- `violations` takes `barrels: true`, under which `source.specs` reports a barrel with no
  specification beside it as it reports any other source. A component package asks for it, because a
  barrel there is where a component's public surface is written and where a recipe or a binding
  leaks out.
