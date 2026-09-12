---
"@stealthscale/vite-config-react": patch
---

State the test environment from the tiers rather than from the workspace preset. The previous
release put `test.document()` at the root on the reasoning that the runner reads its environment
from the root config, and that is wrong: `test.projects` makes every package a project of its own,
and a project is configured by its own config rather than by the root's. A rendering specification
still met `document is not defined`, which is what the root layer was added to prevent.

`test.cleanup()` was already in the tiers for exactly this reason, and the two belong together: a
package that needs a document to draw into is the same package that needs it emptied afterwards.
