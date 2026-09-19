# @stealthscale/theme

## 0.4.0

### Minor Changes

- [#32](https://github.com/stealth-scale/config/pull/32) [`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: publish statusEmitted
  
  - `statusEmitted()` writes the `staticCss` entry a recipe with a `status` axis carries, so every
    status reaches an application's stylesheet whether the application writes one or not. Without it a
    component handed a status from a record, a validator or a server carries a class the compiler
    emitted no rule for.
  - The values are listed rather than asked for with `true`, which the compiler's own types offer for
    an axis and its compiler ignores. They are read from `STATUSES`, so adding a status to the
    vocabulary reaches every recipe without one of them being edited.
  
  theme: publish the safe-area spacing, the reading measure, and a condition for the highlight axis
  
  - `spacing.safe.{top,right,bottom,left}` is the room a device keeps for a home indicator, a notch or
    a rounded corner. Only the browser knows how much, so these read `env()` and answer zero on every
    device that reserves nothing. Anything a page fixes to an edge of the screen reads them, because a
    recipe may not write `env()` itself.
  - `sizes.prose` is the measure body text is read at, stated in characters rather than in rems. The
    line a reader follows without losing their place is counted in characters, so a measure in `ch`
    stays right at every type size a theme sets.
  - `highlightVariants(highlights, when)` takes the condition to write the mark against. A listbox
    marks `_highlighted`, which is the row the keys are on, and a navigation marks `_currentPage`,
    which is the condition `aria-current="page"` sets. The helper wrote `_highlighted` alone before
    this, so a navigation restated the whole axis to change one selector.
  
  theme: publish the field looks as layer styles and open a control's insets
  
  - `layerStyles.field` names `outline` on `bg.panel`, `subtle` on `bg.muted`, and `flushed` with its
    bottom edge alone. A field recipe wrote those colours itself before this, so a theme that restated
    `fill.subtle` moved every control but a field.
  - `fieldVariants()` writes the `variant` axis from those layer styles, beside `lookVariants()` and
    `flatVariants()`. It takes the looks a recipe names, or offers all three.
  - `fieldStatusVariants()` writes the `status` axis of a field: the palette of the status, and the
    edge in the line family's member of the same name. It draws `border.error` for the error status,
    which is the token `field()`'s `_invalid` already draws, so the axis and the attribute agree.
  - `field()` sets `minBlockSize` to `control.md` under `_touch`. A field is a replaced element and no
    pseudo-element renders on one, so the coarse-pointer target is the height rather than the box
    `touchTarget()` grows.
  - `field()` sets the same `transitionProperty`, `transitionDuration` and `transitionTimingFunction`
    as `interactive()`, so a field and a button in one row settle together rather than one snapping.
  - `controlSizes()` writes each inline inset through a custom property with the step as the fallback:
    `paddingInlineStart: var(--control-inset-start, {spacing.inset.<size>})`, and the same for the
    end. `CONTROL_INSET_START` and `CONTROL_INSET_END` name the two.
  - A component that places something inside a control opens the side it needs by setting a property
    rather than by writing padding of its own. The control's own recipe stays the one rule writing its
    padding, so the two never race for the property and a theme that restyles the control keeps the
    room. Every recipe reading `controlSizes()` is groupable through this.
  - Nothing moves for a control outside such a component. The property is unset and the fallback is
    the step the helper wrote before.
  
  theme: add role tables for a ramp keyed by its own steps
  
  - `paletteRoles(ramp, steps, darkRamp)` takes a table naming a step for each role in each mode, or a
    color stated outright, and reads the dark steps from a second ramp where a theme draws one.
    `ROLE_STEPS` is the foundation's own table.
  - `foregrounds(ramp, steps, darkRamp)` and `borders(ramp, steps, darkRamp)` take a table the same
    way, with `FOREGROUND_STEPS` and `BORDER_STEPS` as the foundation's.
  - `surfaces(ramp, steps, darkRamp)` draws the `bg` family from steps of a neutral ramp, for a theme
    whose surfaces sit on its own scale rather than at a distance from the page.
  - `ramp(keys, values)` keys a transcribed ramp by its own step names, and
    `stepped(ramp, light, dark, darkRamp)` writes one color as a reference into a step in each mode.
  - `contrast()` and `luminance()` read an OKLCH color whose hue is `none`.
  - `linear(color)` converts a color to linear sRGB and `oklab(color)` to OKLab, unclamped, for a
    check that measures a distance rather than a ratio.
  - `Application.themes` is optional. An application that states no theme draws the foundation alone.
  - A bound element carries `data-recipe` only where `process.env.NODE_ENV` is not `production`, so a
    production page carries no attribute the testing kit alone reads.

## 0.3.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: keep no value's class on a slot for a compound
  
  - A slot carries the variant classes of the values that style it, and no other. A compound keeps no
    value's class on the slot it styles, because the compiler emits its styles under the compound's
    own class, which the runtime writes where the selection matches. A small outline card with a
    compound on its content carried `card__content--outline` with no rule behind it.
  - `withContext` on a recipe binding takes a variant among its default props, so a component fixes
    one of the recipe's values: `withContext("button", { defaultProps: { shape: "square" } })`.
  - The semantic spacing states `marker`, the gutter a list leaves for the browser's marker, at two
    and a half ems, which is the gutter every browser leaves by default. A recipe writes
    `paddingInlineStart: "marker"`, and a theme moves it.
  - Every geometry scale runs from `xs` to `4xl`: `control` reaches twice its base at `4xl`, `icon`
    three times, `inset` three times and `gap` six times, so a hero's call to action, the mark beside
    it and the room around it grow together on the same names. The `label` role follows to `4xl`,
    growing slower than the control, the `heading` role gains `xs`, `3xl` and `4xl`, and the `body`
    role gains `xs` and `xl`.
  - The type scale gains `8xl` and `9xl`, and the heading role steps over two sizes above `2xl`: `3xl`
    reads at the `6xl` size and `4xl` at the `8xl`. A document heading and a hero heading are
    different things, and the size between them read as neither.
  - A control reads as pressed. `interactive` scales the box to 98 percent, held still for a reader
    who asked for reduced motion. A fill presses to the palette's `emphasized`, a solid fill to the
    ink it hovers to, and a plain one to the palette's solid. An outline fills in as it is hovered and
    further as it is pressed, rather than changing its line, which is the change a hover already
    makes.
  - An outline and a surface clip their background to the padding box, so a rounded corner is drawn as
    one antialiased curve. A fill running under the line laid a second curve over the first, and the
    corners read heavier than the edges they joined.
  - `controlSizes` leads with one step less inset where a mark opens the control, and `touchTarget`
    draws its area before the control's content rather than after it, which leaves the other
    pseudo-element to a look that draws one.
  - The vocabulary a recipe writes its axes from is stated once: `SCALE`, `WIDTHS`, `RATIOS`,
    `CORNERS`, `COUNTS`, `TONES`, `WEIGHTS`, `MOTIONS`, `LIFTED`, `ALIGNMENTS`, `DISTRIBUTIONS` and
    `ROLE_SIZES`, with a helper that writes each axis from it: `gapSizes`, `alignVariants`,
    `justifyVariants`, `columnCounts`, `spanCounts`, `fittedColumns`, `widthSizes`, `ratioVariants`,
    `cornerVariants`, `textSizes`, `toneVariants`, `weightVariants`, `truncate`, `motionVariants` and
    `liftVariants`. Each takes the whole scale where a recipe names no part of it, so no recipe writes
    a scale out and a scale that gains a step needs no edit to a recipe. `onSlot` lifts an axis onto
    one part of a slot recipe.
  - The per-slot pruning drops a class from a slot only where no value that styles the slot writes it.
    A grid drawing three columns and an entry spanning three write the same class on their own slots,
    and the root lost its columns to the entry's span.
  - The semantic sizes state `tag`, the height of something read beside a control rather than pressed:
    a badge, a chip or a pill. It grows on the control's own shares from a base of half the height, so
    a theme that stretches its controls stretches the tags beside them by the same amount.
  - `flatVariants` writes a `variant` axis that holds still, reading the `flat` layer styles: a look
    with a background and an ink and nothing a pointer changes. A badge drawn in a fill repaints
    whenever a pointer crosses it, which reads as a control a reader can press and then cannot. There
    is no flat ghost, because a look that never repaints is identical to plain.
  - `tagSizes` writes the `size` axis of a tag, its height on the tag scale and its inset, its gap and
    its label one step down, and `below` reads the step under the one it is given so a recipe drawing
    something lighter than a control states no order of its own.
  - The animation styles state `pulse`, which loops the keyframe of that name. The keyframe was
    already there and nothing named it, so a recipe that wanted a pulse wrote its own animation.
  - `insetSizes` writes the `size` axis of a padded box, the room inside it on the inset scale. A
    control reads `controlSizes`, which sets a height and pads the sides alone, and a panel, a well or
    an empty state needs every side padded and no height.
  - `onSlots` lifts one axis onto several parts at once, each part reading its own scale. A size axis
    moving four parts together is otherwise one object per step holding one entry per part, which is
    the shape a recipe author should never have to type.
  - `row` writes the base of a row in a list the reader chooses from: a full-width line holding a
    mark, a label and a hint side by side. It carries no focus ring and no press, because such a list
    keeps focus on the container and moves a highlight over its rows, and it draws the arrow pointer
    rather than the hand, which is what the menu pattern asks for.
  - `highlightVariants` writes the `highlight` axis of a list: `tint`, `fill` and `bar`, each a layer
    style under the highlighted condition. `bar` draws a line down the leading edge and tints the row
    behind it, so the row the reader is on is marked twice over. A menu, a select and a combobox all
    mark one row the same three ways, so a theme moves all of them by moving the layer styles.

## 0.2.0

### Minor Changes

- [#25](https://github.com/stealth-scale/config/pull/25) [`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: draw a variant's class on the slots the value styles alone, and a bare heading in its role
  
  - A slot carries the variant classes of the values that style it, through their own styles or
    through a compound matched on them, and no other. The runtime hands every slot the whole variant
    map, so a card's content carried `card__content--lg` with no rule behind it: fifteen such classes
    on one card.
  - A heading with no text style of its own reads in the heading role of its level, `heading.xl` for
    `h1` down to `heading.sm` for `h4` to `h6`, from the base layer. The compiler's reset had left it
    at the size and the weight of the text around it. A text style on the element still overrides the
    role.

### Patch Changes

- Updated dependencies [[`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c)]:
  - @stealthscale/pandacss-naming@0.2.0

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
