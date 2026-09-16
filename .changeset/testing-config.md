---
"@stealthscale/testing-config": minor
---

testing-config: walk namespaces in plugin.named and require configResolved only

- A factory inside a namespace is called, and its plugin is asked to be named for the dotted path,
  so `theme.runtime()` is asked for `stealth:theme.runtime`.
- A plugin is asked for `configResolved` and for no other hook. A plugin that serves at `load`
  passes without `generateBundle`.
