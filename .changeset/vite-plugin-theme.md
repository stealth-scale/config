---
"@stealthscale/vite-plugin-theme": minor
---

vite-plugin-theme: watch the workspace packages and draw the foundation without a theme

- `theme.stylesheet()` hands the source directory of every workspace package the compiler scans to
  the dev server's watcher, so a file added to a package beside the application reaches the compiler
  without a restart.
- An application whose statement names no theme compiles the foundation and the published presets
  alone. `Application.themes` is optional.
