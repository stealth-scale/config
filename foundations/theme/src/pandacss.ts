/**
 * Re-exports every type this package reads from the compiler's type package.
 *
 * @remarks
 *   The type package publishes declarations and nothing else, so an inline type specifier that
 *   names it directly keeps a runtime import of a declaration file. A top-level `export type` is
 *   erased in full, so this module compiles to nothing, and every other module imports its types
 *   from here with the inline form the house lint requires.
 */

export type {
  AnimationStyle,
  AnimationStyles,
  CssKeyframes,
  ExtendableConditions,
  ExtendableUtilityConfig,
  GlobalFontface,
  GlobalStyleObject,
  LayerStyle,
  LayerStyles,
  Preset,
  RecipeRule,
  SemanticTokens,
  StaticCssOptions,
  TextStyle,
  TextStyles,
  ThemeVariant,
  Tokens,
} from "@pandacss/types";
