/**
 * Publishes the vocabulary a recipe, a theme and an application are written in, and nothing that
 * runs in a browser.
 *
 * @remarks
 *   Every name here is read at build time. Separate from the package's own entry because that
 *   entry re-exports the generated runtime, and the compiler's configuration reaches this package
 *   through whatever a theme imports. A theme importing the entry would put every generated file
 *   behind the configuration, and regenerating them would read as the configuration changing. The
 *   two attributes are published here as well as on the entry, so a package that does not render,
 *   such as the testing kit, reads them without loading the provider and its React transform.
 * @packageDocumentation
 */

export { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "#attributes.ts";
export { type Application } from "#authoring/application.ts";
export {
  BACKGROUNDS,
  BORDERS,
  contract,
  type ContractedVariant,
  type Family,
  type Filled,
  FOREGROUNDS,
  type Hue,
  type HuePalette,
  HUES,
  type Mode,
  type Moded,
  MODES,
  type Palette,
  type PaletteRoles,
  PALETTES,
  type Referenced,
  type Role,
  ROLES,
  type SemanticPalette,
  type Status,
  STATUSES,
  type ThemeColors,
  type ThemeTokens,
} from "#authoring/contract.ts";
export { contrast, type Level, luminance, readable } from "#authoring/contrast.ts";
export { type RecipeExtension, type SlotRecipeExtension } from "#authoring/extension.ts";
export { deepMerge } from "#authoring/merge.ts";
export {
  definePreset,
  type Preset,
  type PresetConfig,
  type PresetExtension,
  type Registrable,
} from "#authoring/preset.ts";
export {
  type Compound,
  compoundClassName,
  defineRecipe,
  defineSlotRecipe,
  defineStyles,
  type Recipe,
  type RecipeProps,
  SEPARATOR,
  type SlotCompound,
  type SlotRecipe,
} from "#authoring/recipe.ts";
export {
  type Anatomy,
  controlSizes,
  dense,
  divider,
  type Elevation,
  field,
  floating,
  iconOnly,
  iconSizes,
  interactive,
  link,
  type Look,
  LOOKS,
  lookVariants,
  motion,
  overlay,
  slotsOf,
  statusVariants,
  surface,
  touchTarget,
} from "#authoring/recipes/index.ts";
export {
  defineTheme,
  type DerivedThemeConfig,
  type RootThemeConfig,
  type Theme,
  type ThemeConfig,
} from "#authoring/theme.ts";
export {
  type AnimationStyles,
  type LayerStyles,
  type SemanticTokens,
  type TextStyles,
  type Tokens,
} from "#pandacss.ts";
export {
  absoluteCenter,
  type AbsoluteCenterProps,
  bento,
  bentoCell,
  type BentoCellProps,
  type BentoProps,
  center,
  type CenterProps,
  cluster,
  type ClusterProps,
  cover,
  type CoverProps,
  type FixedStackProps,
  flex,
  type FlexProps,
  frame,
  type FrameProps,
  grid,
  type GridProps,
  hstack,
  reel,
  type ReelProps,
  responsive,
  scrollable,
  type ScrollableProps,
  sidebar,
  type SidebarProps,
  simpleGrid,
  type SimpleGridProps,
  stack,
  type StackProps,
  sticky,
  type StickyProps,
  switcher,
  type SwitcherProps,
  visuallyHidden,
  vstack,
} from "#patterns/index.ts";
export {
  alphaScale,
  backgrounds,
  borders,
  colorScale,
  controls,
  families,
  type Families,
  fontSizes,
  foregrounds,
  gaps,
  icons,
  insets,
  neutralFills,
  oklch,
  type PageLightness,
  paletteAlias,
  type PaletteAliases,
  paletteRoles,
  palettes,
  type Palettes,
  radii,
  type Scale,
  shadows,
  slides,
  typography,
} from "#scales/index.ts";
