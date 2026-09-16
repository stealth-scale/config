---
"@stealthscale/vite-plugin-base": patch
---

vite-plugin-base: pack under the shared plain configuration

- The plugin is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
  tier.
- `engines.node` is `>=26.0.0`.
- `README.md` ships in the tarball, covering every export and the four kinds of module the crawl
  leaves out.
- `description` is a sentence naming what the package does.
