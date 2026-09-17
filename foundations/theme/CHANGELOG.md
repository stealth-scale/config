# @stealthscale/theme

## 0.1.1

### Patch Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`459eb8c`](https://github.com/stealth-scale/config/commit/459eb8cdeb48bea844b906098740c941aec22278) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: name every compound in its recipe and read the sizes from the tokens
  
  - `defineRecipe` writes `className` on every compound from the axes it matches on, and
    `defineSlotRecipe` splits a compound into one per slot it styles, each named. The compiler emits a
    compound's styles under that class and the binding emits the same class at run time.
  - `compoundClassName(className, compound)` publishes the scheme from `./authoring`.
  - `typography()` writes each size as a reference to the `fontSizes` token of the same name.
  - `slide-fade.out` leaves towards the side the anchor is on: `top` to `slide-to-bottom`.
  - `Elevation` names the shadow step `surface()` takes. `Level` is the contrast level alone.
  - `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` are defined once, in `attributes.ts`, and published
    from `./authoring` beside the entry, so a package that does not render reads them without loading
    the provider.
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
    count responsive. A row defaults to `{sizes.32}`, written as a token reference because the
    compiler binds no scale to `gridAutoRows`.
  - The textured backdrops draw in the line color and the emphasized surface, the aurora drifts
    through the muted fills, and `text.shine` bands the emphasized fill in light mode and the solid in
    dark mode. The subtle line and the subtle surface are two points of lightness from a light page,
    so each of these was there in dark mode alone.
  - `Application` takes `presets`, the presets an application writes for recipes of its own, which the
    build plugin installs after every package's preset and before the themes.
  - `defineTheme` refuses a compound matched on a value a class name cannot carry, so the compiler
    never emits one that is compiled and never applied. The extension type admits a style object on an
    axis, which nothing refused.
  - `ThemeProvider` holds the pair it hands down across a render that changes neither, so a part that
    reads it redraws when the page switches and not when the provider's parent redraws. The published
    package carries no compiler, so nothing else held it.
  - `compoundSelection(compound)` writes the selection a compound matches on, in the scheme the
    compiler names it by, and returns nothing where a class name cannot carry a value.
    `compoundClassName` writes the class over it, and a reader that wants the name asks for the
    selection rather than taking a class apart.
  - `createSlotRecipeContext` stamps the recipe's name as `data-recipe` on the part that provides the
    variants, so a compound component is found by the same handle as one that draws a single element.
    The compiler's own option does nothing there, because it reads a name off the recipe a part is
    styled with and a part is styled with the slot's styles alone.
  - The document's color scheme is stated on the light attribute as well as the dark one, so a subtree
    switched to light inside a page drawn dark draws its form controls, its scrollbars and its
    selection in light. The colors a theme states still do not follow it there.
  - The preference half of the `dark` and `light` conditions is anchored to the document root. The
    compiler replaces the nesting selector with a theme's own and the default theme has none, so the
    half compiled to a bare negation that matched every element: a page switched to a theme under an
    operating system set to dark drew that theme on the element carrying the attribute and the default
    theme's dark values on everything below it.
  - `SEPARATOR`, published from `./authoring`, is the underscore the build plugin configures the
    compiler with between an axis and its value. `compoundClassName` writes it, so a compound the
    compiler names reads `button--compound__size_lg__variant_solid` before the plugin renames the
    stylesheet and the runtime. The package depends on `@stealthscale/pandacss-naming`, which its
    generated runtime imports, so a bound element's variant class reads `button--lg`.
  - The `meteor` keyframe falls by `--meteor-travel`, the viewport where the element states none, so a
    sky bounded by a box states the fall it needs. It fell 100vw at 35 degrees below the horizontal,
    which carried it out of a sky 128 pixels tall inside the first percent of the loop. The `meteor`
    animation style offsets each streak by `--stagger`, a share of the loop, as `twinkle` offsets each
    dot.
  - `backdrop.stars` tiles a field of nine dots drawn in `currentcolor`, in a tile twice as wide as it
    is tall. It is laid over a surface a recipe inverts, and the ink of that surface is the only color
    that follows it. A square tile repeats often enough across a wide sky to read as a rhythm, and its
    lower half falls outside a short one.
  - `backdrop.stripes` rules its diagonal a whole pixel wide. Half a pixel across a diagonal samples
    to a dashed line. `backdrop.grid` holds at half, because an upright line does not.
  - The aurora alternates the emphasized fill with the muted one, so it moves through lightness as
    well as hue, and it reads as the palette rather than as a haze. Every fill of one role sits at one
    lightness, and the muted fill is two points of chroma from the emphasized one.
  - A compound takes a `name`, and `defineRecipe` writes its class from it through
    `@stealthscale/pandacss-naming`, so a large solid button named `hero` carries `button--hero` and a
    slot compound `card__root--hero`. The name is removed once the class is written, because the
    compiler and the runtime read every other key as an axis. A compound without a name keeps the
    compiler's own class, which the testing kit reports.
  - The global styles declare the six properties the reset reads, the ink, the palette and the font on
    every element that switches a theme or a color mode, beside the root. A property set on the root
    is inherited as its computed value, so a subtree switched to another theme kept the root's font
    and ink while its own tokens said otherwise.
  - The ripple grows from the point of the press, which a component writes as `--ripple-x` and
    `--ripple-y` and which falls at the centre where it writes none, and it fades at full size over
    the release rather than shrinking back. It was a rounded rectangle cut to the control's outline.
    The press snapped it to nothing and the release grew it, so a reader pressing the control saw
    nothing until they let go. Its rim is soft, and it is tinted at the opacity a pressed state layer
    takes. `--ripple-scale` is how far it grows, as a multiple of its own width, and `--ripple-pace`
    scales every duration at once, which a reader who asked for less motion sets to zero.
- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-naming@0.1.0

## 0.1.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`40e6dd7`](https://github.com/stealth-scale/config/commit/40e6dd71b061799fb2d2926d8a88f486275ffe3c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: add the design-system package
  
  - `./theme` publishes the foundation: nineteen token categories, the three color families and
    nineteen palettes of twelve roles, the compositions, the keyframes, the conditions and the global
    styles, held to 7:1 for text and 3:1 for lines.
  - `./authoring` publishes the definitions, the contract, the scales, the recipe helpers, the
    patterns and the contrast measurement.
  - `.` publishes the generated runtime, the two bindings and the two attributes a page is switched
    with.
