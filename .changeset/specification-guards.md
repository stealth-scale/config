---
"@stealthscale/provider-form": patch
"@stealthscale/provider-locale": patch
---

specifications: stop reading the page's real local storage

The locale provider's pending case and the draft specification both read the page's real local
storage. Node 26 defines `globalThis.localStorage` and answers `undefined` for it without
`--localstorage-file`, so each run reported `ExperimentalWarning: localStorage is not available`.

The pending case now takes a memory store like every case beside it. The draft specification stubs a
working storage, which is what it takes to check that the draft is written and cleared. Reading a
storage that answers nothing proved only that the hook does not throw.
