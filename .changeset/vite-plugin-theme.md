---
"@stealthscale/vite-plugin-theme": minor
---

vite-plugin-theme: generate the styling runtime and compile the stylesheet

- `theme.runtime()` generates the runtime a design-system package publishes, from the preset it
  publishes under `./theme`, into `generated/`, and regenerates it when a file behind the preset
  changes.
- `theme.stylesheet()` loads an application's `theme.config.ts` and every contributor's preset
  through Vite, renders the compiler's configuration with every value inlined, compiles the
  stylesheet into whichever file declares the cascade order, and recompiles on a change.
- Every theme is compiled under `data-theme`, the first theme unscoped as well, and the compiler's
  name appears nowhere in the output.
