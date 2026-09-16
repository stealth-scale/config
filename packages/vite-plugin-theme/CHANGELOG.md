# @stealthscale/vite-plugin-theme

## 0.1.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: generate the styling runtime and compile the stylesheet
  
  - `theme.runtime()` generates the runtime a design-system package publishes, from the preset it
    publishes under `./theme`, into `generated/`, and regenerates it when a file behind the preset
    changes.
  - `theme.stylesheet()` loads an application's `theme.config.ts` and every contributor's preset
    through Vite, renders the compiler's configuration with every value inlined, compiles the
    stylesheet into whichever file declares the cascade order, and recompiles on a change.
  - Every theme is compiled under `data-theme`, the first theme unscoped as well, and the compiler's
    name appears nowhere in the output.

### Patch Changes

- Updated dependencies [[`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354)]:
  - @stealthscale/vite-plugin-base@0.2.0
