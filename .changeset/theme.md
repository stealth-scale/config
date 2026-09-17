---
"@stealthscale/theme": patch
---

theme: name every compound in its recipe and read the sizes from the tokens

- `defineRecipe` writes `className` on every compound from the axes it matches on, and
  `defineSlotRecipe` splits a compound into one per slot it styles, each named. The compiler emits a
  compound's styles under that class and the binding emits the same class at run time.
- `compoundClassName(className, compound)` publishes the scheme from `./authoring`.
- `typography()` writes each size as a reference to the `fontSizes` token of the same name.
- `slide-fade.out` leaves towards the side the anchor is on: `top` to `slide-to-bottom`.
- `Elevation` names the shadow step `surface()` takes. `Level` is the contrast level alone.
- `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` are defined once, in `attributes.ts`.
- `switcher()` reads its threshold against the size scale where it is a name, as `simpleGrid()`
  reads its narrowest column, and switches at `md` when nothing is stated.
- `RecipeExtension` and `SlotRecipeExtension` take `compoundVariants` as an open record of axes with
  the styles under `css`. The compiler's selection type refused the `css` key.
- `definePreset` takes a `PresetConfig`, whose recipes are typed over the members every recipe and
  extension share, so a preset registers a recipe as `defineRecipe` returns it. The compiler's
  preset type refused one.
- `families(pages, hue, chroma)` and `palettes(aliases)` fill the color contract in two calls. The
  foundation draws its own families and palettes with them.
- `createRecipeContext` and `createSlotRecipeContext` return `RecipeBinding` and
  `SlotRecipeBinding`, whose factories are typed by `StyledComponent`. A package that exports a
  bound component emits a declaration that refers to this package alone.
- `./authoring` publishes `Tokens`, `SemanticTokens`, `TextStyles`, `LayerStyles` and
  `AnimationStyles`, for a theme that states a category in a file of its own.
- The `dark` and `light` conditions and the document's color scheme follow the operating system's
  preference where a page writes no color mode attribute, and the attribute where it does.
- `ThemeProvider` writes the theme and the color mode onto the document root and removes what a page
  stops stating, and `useTheme()` reads them below it.
- The foundation gains the candy. The layer styles `glow.{sm,md,lg}`, `border.moving`, `glass`,
  `text.gradient`, `text.shine` and `backdrop.{dots,grid,spotlight,aurora}` draw it. The animation
  styles `sweep`, `marquee`, `float`, `pulse-glow`, `aurora`, `meteor` and `spin` move it. The
  gradients `brand`, `shine` and `aurora` are semantic tokens, `--angle` is registered as an angle,
  and `ambientSlower` joins the durations.
- The second round of candy adds the layer styles `blur.{sm,md,lg}`, `dim.others`,
  `mask.{bottom,edges,radial}`, `ripple` and `backdrop.{stripes,checker,noise,vignette}`, and the
  animation styles `rise`, `reveal`, `parallax`, `progress` and `twinkle`, the middle three driven
  by the scroll position. The `sticky` pattern joins the patterns, and the page scrolls smoothly
  unless the reader asked for less motion.
- `bento(props)` and `bentoCell(props)` draw a dense grid of tiles that span columns and rows, each
  count responsive.
