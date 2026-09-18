---
"@stealthscale/vite-plugin-theme": minor
---

vite-plugin-theme: watch the workspace packages and draw the foundation without a theme

- `theme.stylesheet()` hands the source directory of every workspace package the compiler scans to
  the dev server's watcher, so a file added to a package beside the application reaches the compiler
  without a restart.
- An application whose statement names no theme compiles the foundation and the published presets
  alone. `Application.themes` is optional.
- The compiler's base preset is installed without its patterns in both rendered configurations, so
  the runtime carries no pattern module and the compiler reports no conflict between a recipe named
  `stack`, `grid`, `container`, `divider` or `spacer` and a pattern of the same name.
