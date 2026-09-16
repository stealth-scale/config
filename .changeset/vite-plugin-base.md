---
"@stealthscale/vite-plugin-base": patch
---

vite-plugin-base: pack under the shared plain configuration

- The plugin is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
  tier.
- `engines.node` is `>=26.0.0`.
