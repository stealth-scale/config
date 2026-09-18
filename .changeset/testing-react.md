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
- `drawn` renders a component built on a state machine and waits for the machine to commit. The
  machine commits its first state on a microtask after mounting, so a bare render leaves an update
  outside the act scope React checks. Measured on the tabs fixture: a bare render, a render followed
  by a synchronous act, and a render inside one each report two such updates, and this reports none.
  The disclosure package reported 140 of them before this and reports none after.
- `pressed` fires the three events a browser fires for a press, and settles the machine between the
  press and the click. A machine that moves its highlight as the pointer goes down and reports the
  highlighted row on the click reports nothing at all for a sequence fired in one turn.
- `accessibilityViolations` settles the render before axe reads it, so a component built on a state
  machine is audited in the state it reaches rather than the one it mounts in.
