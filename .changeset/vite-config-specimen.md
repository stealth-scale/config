---
"@stealthscale/vite-config-specimen": minor
---

exclude specimens from package coverage

- `uncounted(files)` contributes `test.omit` for `**/*.specimen.tsx`.
- `layers()` carries that omission and is the call a package holding specimens makes.
- `catalogue(options)` is the call an application showing a catalogue makes, and carries what
  `layers(options)` carried.
