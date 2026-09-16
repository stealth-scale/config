---
"@stealthscale/vite-config-plain": minor
---

vite-config-plain: publish the configuration the kernel and the plugins are packed under

- `plain` is one `UserConfig` with the `pack`, `resolve`, `ssr` and `test` blocks the node tier
  states.
- `vite-config-core`, `vite-plugin-base` and `vite-plugin-sbom` import it. Each carried a copy
  before.
