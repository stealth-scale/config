---
"@stealthscale/vite-plugin-sbom": patch
---

vite-plugin-sbom: read the lockfile through the base plugin

- `locked` and `Installed` come from `@stealthscale/vite-plugin-base`, and the direct dependency on
  `yaml` goes with them.
