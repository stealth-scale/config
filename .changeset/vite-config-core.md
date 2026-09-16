---
"@stealthscale/vite-config-core": minor
---

vite-config-core: add named(), and import vite

- `named(name, layer)` returns the same layer under another name. A factory that builds its layer
  from another factory uses it to name the result for its own call.
- The kernel imports `vite` and peers on `vite` from the peer catalog. `vite-plus` is not a peer.
- The kernel is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
  tier.
- `engines.node` is `>=26.0.0`.
