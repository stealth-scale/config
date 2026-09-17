# @stealthscale/vite-plugin-theme

## 0.1.1

### Patch Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ba436f5`](https://github.com/stealth-scale/config/commit/ba436f5c114bdf1287f81058c12b6c3aee1df8c5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: declare the class a compound's styles are emitted under
  
  - The generated `recipes/runtime.d.mts` types `className` on a recipe's compound and `classNames` on
    a slot recipe's, which the runtime reads and the recipe writes.
  - `LAYER_DECLARATION` publishes the at-rule an application's stylesheet opens with, under the layer
    names an application gets without stating any. Renaming a layer left every specification that
    wrote the line out asserting against the old names.
  - `theme.stylesheet()` installs the presets an application states under `presets` in
    `theme.config.ts`, after every package's preset and before the themes, so a theme extends a recipe
    written in the application as it extends one a package published.
  - Both rendered configurations set the compiler's `separator` to its default underscore, and the
    plugin rewrites what the compiler writes into the naming scheme of `@stealthscale/pandacss-naming`
    through `@stealthscale/pandacss-compiler`: `generateRuntime` rewrites the generated runtime before
    it syncs it, and the stylesheet plugin renames every class selector after it compiles. A variant
    reads `button--lg`, a boolean axis `card__content--bleed` and nothing at `false`, a slot
    `card__root`, and an atomic class `grid-ar-sizes-32` or `md:grid-tc-repeat-3-minmax-0-1fr`. What
    the rename found is reported as a third stage, `the class names`. `SEPARATOR` and
    `THEME_ATTRIBUTE` are exported, so a package that writes the same names can hold itself to them.
  - A theme's compound takes the class the published recipe emits its own compound for the same
    selection under, so a theme that extends the `hero` compound of a button draws under
    `[data-theme=forge] .button--hero`. A compound over a slot recipe is split per slot it styles, as
    the recipe's own was. `publishedCompounds(presets)` reads the classes, and `scopedPresets` takes
    them.
  - Every theme's variant is completed with the foundation's tokens and semantic tokens before it is
    installed, so a subtree switched to a theme is drawn from that theme and the foundation alone. A
    theme that stated no font took the font of the theme around it, because a custom property inherits
    and the compiler emits only what a variant states.
- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-compiler@0.1.0
  - @stealthscale/vite-plugin-base@0.2.0

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
