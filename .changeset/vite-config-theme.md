---
"@stealthscale/vite-config-theme": minor
---

vite-config-theme: add the runtime and stylesheet contributions

- `runtime()` adds `theme.runtime()` to the plugins of the design-system package, and `stylesheet()`
  adds `theme.stylesheet()` to the plugins of an application.
- `layers()` and `workspace()` contribute nothing, so every package lists every add-on the same way.
