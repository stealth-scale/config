---
"@stealthscale/vite-plugin-theme": patch
---

vite-plugin-theme: declare the class a compound's styles are emitted under

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
