---
"@stealthscale/vite-config": patch
---

Stop `require-jsdoc` writing docblocks. Its fixer inserts an empty block — `/**`, ` *`, ` */` —
which satisfies nothing: it fails the formatter, it fails `no-blank-blocks` and
`require-description`, and it takes the report away from the one rule that said what was missing.
Running `vp check --fix` over a repository that had not documented much filled it with them, and
each run left the tree in a state the next check reported differently. A docblock is the one fix a
machine cannot write, so the author writes it.
