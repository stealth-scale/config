/**
 * Defines a theme once and yields both shapes it is consumed in: a preset the compiler installs,
 * and a variant an attribute switches to.
 *
 * @remarks
 *   A theme states values and recipe extensions, and never names a component. It has no
 *   `conditions`, `utilities`, `patterns` or `breakpoints` member because the runtime is generated
 *   once from the foundation, and a condition a theme added would reach the stylesheet and not the
 *   runtime a recipe is typed against.
 */

import { contract, type ThemeTokens } from "#authoring/contract.ts";
import { type RecipeExtension, type SlotRecipeExtension } from "#authoring/extension.ts";
import { deepMerge } from "#authoring/merge.ts";
import { definePreset, type PresetExtension, type Registrable } from "#authoring/preset.ts";
import { compoundSelection } from "#authoring/recipe.ts";
import {
  type AnimationStyles,
  type GlobalFontface,
  type GlobalStyleObject,
  type LayerStyles,
  type Preset,
  type SemanticTokens,
  type TextStyles,
  type ThemeVariant,
  type Tokens,
} from "#pandacss.ts";

/**
 * Fixes the prefix every theme's preset is named with, so a compiler diagnostic names the theme.
 */
const PRESET_PREFIX = "@stealthscale/theme-";

/**
 * Describes what every theme states, whether it is built on another or not.
 */
interface ThemeConfigBase {
  /**
   * Named motions a recipe reads with `animationStyle`.
   */
  animationStyles?: AnimationStyles | undefined;

  /**
   * Faces the theme hosts itself rather than taking from a package.
   */
  fontface?: GlobalFontface | undefined;

  /**
   * The packages carrying the faces the theme names. The theme depends on them, and the
   * application's stylesheet imports them.
   */
  fonts?: readonly string[] | undefined;

  /**
   * Changes to the page itself rather than to what is drawn on it.
   */
  globalCss?: GlobalStyleObject | undefined;

  /**
   * Named looks a recipe reads with `layerStyle`.
   */
  layerStyles?: LayerStyles | undefined;

  /**
   * The word an application installs the theme by and a page writes in the attribute that
   * switches to it.
   */
  name: string;

  /**
   * Changes to recipes that draw one element, keyed by the recipe's key.
   */
  recipes?: Readonly<Record<string, RecipeExtension>> | undefined;

  /**
   * Values that change with the color mode.
   */
  semanticTokens?: SemanticTokens | undefined;

  /**
   * Changes to recipes that draw several parts, keyed by the recipe's key.
   */
  slotRecipes?: Readonly<Record<string, SlotRecipeExtension>> | undefined;

  /**
   * Named typography a recipe reads with `textStyle`. Read at build time only, because the
   * switchable shape carries tokens and nothing else.
   */
  textStyles?: TextStyles | undefined;

  /**
   * Values that do not change with the color mode: the ramps, the faces, the sizes.
   */
  tokens?: Tokens | undefined;
}

/**
 * Describes a theme that is the root of its own vocabulary, which fills the contract itself.
 */
export interface RootThemeConfig extends ThemeConfigBase {
  /**
   * Nothing to build on.
   */
  extends?: undefined;

  /**
   * Every color the contract names, and whatever else the theme moves.
   */
  semanticTokens: ThemeTokens;
}

/**
 * Describes a theme built on another, which states what differs and nothing else.
 */
export interface DerivedThemeConfig extends ThemeConfigBase {
  /**
   * The theme this one is built on, which filled the contract already.
   */
  extends: Theme;
}

/**
 * Describes what a theme states.
 */
export type ThemeConfig = DerivedThemeConfig | RootThemeConfig;

/**
 * Describes a theme in both the shapes it is consumed in.
 */
export interface Theme {
  /**
   * The packages carrying its faces, its ancestors' included.
   */
  fonts: readonly string[];

  /**
   * The word an application installs it by and a page switches to it with.
   */
  name: string;

  /**
   * The build-time shape: everything the theme states, as a preset. A derived theme nests its
   * parent's preset here, so the compiler composes the lineage.
   */
  preset: Preset;

  /**
   * The run-time shape: the values alone, switched by an attribute. Recipe extensions travel in
   * the preset, and the build scopes them under the same attribute.
   */
  variant: ThemeVariant;
}

/**
 * Refuses a compound matched on a value a class name cannot carry.
 *
 * @remarks
 *   The compiler names a theme's compound by the same scheme as the component's, so a value it
 *   cannot write is a compound that is compiled and never applied. Refused where the theme is
 *   defined, so no application has to find it in a compiled stylesheet.
 * @throws {@link Error} When a compound matches an axis on such a value.
 */
function nameable(extensions: Readonly<Record<string, Registrable>> | undefined): void {
  for (const [key, extended] of Object.entries(extensions ?? {})) {
    for (const compound of extended.compoundVariants ?? []) {
      if (compoundSelection(compound) !== undefined) continue;

      throw new Error(
        `${key} is extended with a compound matched on a value a class name cannot carry`,
      );
    }
  }
}

/**
 * Collects everything a theme adds under `extend`, which is what makes an extension merge over
 * the recipe rather than replace it.
 *
 * @throws {@link Error} When a compound matches an axis on a value a class name cannot carry.
 */
function extension(config: ThemeConfig): PresetExtension {
  const { animationStyles, layerStyles, recipes, semanticTokens, slotRecipes, textStyles, tokens } =
    config;

  nameable(recipes);
  nameable(slotRecipes);

  return {
    ...(animationStyles === undefined ? {} : { animationStyles }),
    ...(layerStyles === undefined ? {} : { layerStyles }),
    ...(recipes === undefined ? {} : { recipes }),
    ...(semanticTokens === undefined ? {} : { semanticTokens }),
    ...(slotRecipes === undefined ? {} : { slotRecipes }),
    ...(textStyles === undefined ? {} : { textStyles }),
    ...(tokens === undefined ? {} : { tokens }),
  };
}

/**
 * Builds the switchable half of a theme.
 *
 * @remarks
 *   A root theme is checked against the contract here, because this is where its palette is read.
 *   A derived theme is not, because the theme beneath it filled the contract, and asking it to
 *   restate every role would defeat deriving.
 */
function variant(config: ThemeConfig): ThemeVariant {
  const tokens = config.tokens ?? {};

  if (config.extends !== undefined) {
    return {
      ...(config.semanticTokens === undefined ? {} : { semanticTokens: config.semanticTokens }),
      tokens,
    };
  }

  return contract({ semanticTokens: config.semanticTokens, tokens });
}

/**
 * Defines a theme and returns it as a preset an application installs and as a variant a page
 * switches to.
 *
 * @remarks
 *   A derived theme nests its parent's preset under its own, merges its switchable values over
 *   its parent's, and names its parent's font packages beside its own.
 */
export function defineTheme(config: ThemeConfig): Theme {
  const { extends: parent, name } = config;
  const preset = definePreset({
    ...(parent === undefined ? {} : { presets: [parent.preset] }),
    ...(config.fontface === undefined ? {} : { globalFontface: config.fontface }),
    ...(config.globalCss === undefined ? {} : { globalCss: config.globalCss }),
    name: `${PRESET_PREFIX}${name}`,
    theme: { extend: extension(config) },
  });
  const own = variant(config);

  return {
    fonts:
      parent === undefined
        ? (config.fonts ?? [])
        : [...new Set([...parent.fonts, ...(config.fonts ?? [])])],
    name,
    preset,
    variant: parent === undefined ? own : deepMerge(parent.variant, own),
  };
}
