---
"@stealthscale/vite-plugin-theme": patch
---

vite-plugin-theme: declare the class a compound's styles are emitted under

- The generated `recipes/runtime.d.mts` types `className` on a recipe's compound and `classNames` on
  a slot recipe's, which the runtime reads and the recipe writes.
- `theme.stylesheet()` installs the presets an application states under `presets` in
  `theme.config.ts`, after every package's preset and before the themes, so a theme extends a recipe
  written in the application as it extends one a package published.
- Both rendered configurations set the compiler's `separator` to a hyphen, so a variant reads
  `button--size-lg` and a compound `button--compound__size-lg__variant-solid`. `SEPARATOR` and
  `THEME_ATTRIBUTE` are exported, so a package that writes the same names can hold itself to them.
