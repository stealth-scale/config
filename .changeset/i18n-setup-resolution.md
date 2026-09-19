---
"@stealthscale/vite-config-i18n": patch
---

find the setup file before the foundation has been built

`worded` resolved `@stealthscale/provider-i18n/testing` at module scope, which is built output. The
runner loads every package's configuration to assemble its task graph, and that happens before
anything has been built, so the first package to call `i18n.layers()` failed the whole graph rather
than one build.

The manifest is resolved instead, which a workspace holds whatever it has built. A workspace then
answers with the source and an installed copy, which publishes no source, answers with the built
file.
