---
"@stealthscale/vite-config-plain": minor
---

vite-config-plain: publish the configuration the kernel and the plugins are packed under

- `plain` is one `UserConfig` with the `pack`, `resolve`, `ssr` and `test` blocks the node tier
  states.
- `vite-config-core`, `vite-plugin-base` and `vite-plugin-sbom` import it. Each carried a copy
  before.
- `README.md` ships in the tarball, covering the four blocks `plain` sets and the two the node tier
  adds on top of them.
- `description` is a sentence naming what the package does.
