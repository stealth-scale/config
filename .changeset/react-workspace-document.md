---
"@stealthscale/vite-config-react": minor
---

Give the runner a document to draw into. A workspace holding anything that renders needs one
everywhere, and the runner takes its environment from the root config — so every repository taking
this package had to know to state `test.environment` itself, and one that did not met
`document is not defined` on its first rendering specification. That reads as a broken test rather
than as a missing setting.

`happy-dom` rather than jsdom, because a theme follows the reader's colour-mode preference and jsdom
has never implemented media queries. It is now a peer of this package rather than an optional one of
the toolchain, since a repository that renders is not optional about having somewhere to render. A
repository testing against something else takes `test.environment(happy-dom)` back by name.
