---
"@stealthscale/hooks": patch
---

hooks: prove the stale measurement guard in useIsOverflowing

The specification for `useIsOverflowing` passing over a measurement queued for an element it no
longer watches passed with the guard deleted. Both elements registered their measurement on one
`document.fonts.ready`, so the fresh element's ran last and wrote the expected answer whether the
guard held or not. Each element now waits on its own promise. The stale element's promise is
resolved and the fresh element's is left outstanding, so the measurement the guard has to refuse is
the one that would write the answer. Resolving it inside `act` also drops the React warning about an
update outside it.
