---
"@stealthscale/testing-config": minor
---

testing-config: require a specification beside every source file

- `source.specs` runs for a config, a plugin and a library, and reports each file under `src` with
  no `.spec.ts` or `.spec.tsx` beside it.
- The pairing is by path rather than by what a specification imports, so a file whose cases were
  folded into a sibling's specification reads as uncovered. A reader opening a source file finds its
  cases in one place.
- A barrel is left alone. It re-exports what the files around it declare, and the conformance
  specification every package already runs is what reads a barrel. A fixture, a declaration file and
  a module whose every export is an `export type` are left alone for the same reason.

The check runs in every package that already asserts on an empty array, so nothing but the selection
has to change to take it.
