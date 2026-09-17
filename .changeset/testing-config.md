---
"@stealthscale/testing-config": minor
---

testing-config: hold a package's barrels to a specification where it asks

- `violations` takes `barrels: true`, under which `source.specs` reports a barrel with no
  specification beside it as it reports any other source. A component package asks for it, because a
  barrel there is where a component's public surface is written and where a recipe or a binding
  leaks out.
- The walk into a barrel enters an object once. A React context provider reaches itself through its
  context, and the walk overflowed the stack on a package that published one.
