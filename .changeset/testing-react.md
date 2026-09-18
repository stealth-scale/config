---
"@stealthscale/testing-react": minor
---

testing-react: check that a component honours as

- `violations` takes an `as` option beside `asChild`. It renders the component with `as: "a"` and
  reports `does not honour as` where the element read back is not an anchor, which is what a
  component bound through the compiler's factory owes a caller who changes its element.
- `accessibilityViolations` renders a component under the same `props` and `wrapper`, runs axe over
  it, and returns each rule it breaks as `id: help`. The kit depends on `axe-core` for it.
- `settled` waits for whatever the last interaction started. A state machine schedules its own
  update rather than making one during the event, so an assertion straight after `fireEvent` reads
  the state from before the press. It flushes inside `act`, which also stops React warning about an
  update it did not see.
- `rootedViolations` draws each part of a component on its own and reports the ones that draw rather
  than throw. A part reads its machine through a context the root provides, so one drawn outside its
  root has no api, and answering nothing there gives a part with no behaviour and no complaint. A
  part that throws something other than what was expected is reported apart from one that drew.
