---
"@stealthscale/vite-config": patch
---

Leave a docblock that already fits as it was written. The formatter rewraps every docblock greedily
on its own, and that fights the linter: `check-line-alignment` asks for a two-space wrap indent, and
a greedy rewrap drops it wherever the description runs over by exactly one word. A file in that
shape satisfies neither tool — `vp fmt` writes what `vp check` rejects, and the two undo each other
on every run.

`lineWrappingStyle: "balance"` wraps only what does not fit, so the width is still enforced and a
docblock the author already wrapped is left alone. The one-word case is a defect in the formatter
rather than in this configuration, and a file that was correct to begin with now stays that way.
