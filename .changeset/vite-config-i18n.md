---
"@stealthscale/vite-config-i18n": minor
---

vite-config-i18n: configure a package that ships catalogues

- `catalogued()` appends the catalogue plugin to `plugins`, and every plugin option passes through.
- `worded()` appends the foundation's setup file to `test.setupFiles`.
- `layers()` returns both, for a tier to extend with. It returns a list rather than a tier, because
  a library and an application both ship catalogues and each picks its own tier.
