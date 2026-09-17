/**
 * Scopes a theme's extensions to the attribute that switches to it.
 *
 * @remarks
 *   A theme's token values reach the page as custom properties, which a selector redefines. Its
 *   recipe extensions and its compositions reach the page as declarations inside a rule, which no
 *   selector can touch. Nesting each under `[data-theme=<name>] &` gives the compiler a second rule
 *   to emit: `[data-theme=abyss] .button--variant-solid` carries one attribute more than the rule
 *   it extends, so it wins while the attribute is set and matches nothing while it is not. Only the
 *   declarations a theme states are emitted, so the cost follows the theme rather than the size of
 *   the recipe layer.
 */

import { THEME_ATTRIBUTE } from "#options.ts";

/**
 * Carries whatever an extension states about how something is drawn.
 */
type Styles = Readonly<Record<string, unknown>>;

/**
 * One entry of an extension's compound variants: the axes it applies to, and the styles it applies.
 */
export interface Compound {
  /**
   * An axis and the value it has to hold.
   */
  [axis: string]: unknown;

  /**
   * The styles it applies where every axis it names matches.
   */
  css?: Styles | undefined;
}

/**
 * Describes what a theme changes about one recipe.
 */
export interface Extension {
  /**
   * The styles it changes for every instance.
   */
  base?: Styles | undefined;

  /**
   * The styles it changes for a combination of variants.
   */
  compoundVariants?: readonly Compound[] | undefined;

  /**
   * The styles it changes for one value of one axis, by axis and then by value.
   */
  variants?: Readonly<Record<string, Readonly<Record<string, Styles>>>> | undefined;
}

/**
 * Groups the extensions a theme makes, as the preset holding them exposes them.
 *
 * @remarks
 *   A composition is a text, layer or animation style: a tree of names whose leaves hold a
 *   `value`, and it is scoped by nesting each value under the attribute. A theme's tokens,
 *   keyframes and global styles are not extensions: the compiler switches tokens through the
 *   attribute on its own, and a keyframe or a global style has no rule to nest under it, so only
 *   the first theme's apply.
 */
export interface Extensions {
  /**
   * Animation styles, by name.
   */
  animationStyles?: Styles | undefined;

  /**
   * Layer styles, by name.
   */
  layerStyles?: Styles | undefined;

  /**
   * Extensions to recipes that draw one element, by key.
   */
  recipes?: Readonly<Record<string, Extension>> | undefined;

  /**
   * Extensions to recipes that draw several elements, by key.
   */
  slotRecipes?: Readonly<Record<string, Extension>> | undefined;

  /**
   * Text styles, by name.
   */
  textStyles?: Styles | undefined;
}

/**
 * Describes a preset as a theme is written into one, read for its extensions and for the preset
 * beneath it.
 *
 * @remarks
 *   Declared here rather than imported. The package that writes these is one an application
 *   bundles, and such a package may not name a build tool, so the two agree structurally.
 */
export interface SwitchablePreset {
  /**
   * The name the compiler reports the preset by.
   */
  name?: string | undefined;

  /**
   * The presets it is built on. A theme derived from another nests that theme's preset here.
   */
  presets?: readonly unknown[] | undefined;

  /**
   * The additions the preset makes.
   */
  theme?:
    | {
        /**
         * Everything the preset adds rather than replaces.
         */
        extend?: Extensions | undefined;
      }
    | undefined;
}

/**
 * Describes a theme, read for its name and the extensions its preset carries.
 */
export interface Switchable {
  /**
   * The name a page switches to the theme by, which is the value of the attribute.
   */
  name: string;

  /**
   * The preset whose additions hold the theme's extensions.
   */
  preset?: SwitchablePreset | undefined;
}

/**
 * Carries one theme's extensions, each nested under the attribute that switches to the theme.
 */
export interface ScopedPreset {
  /**
   * The name the compiler reports the preset by.
   */
  name: string;

  /**
   * The extensions. A token stated here would install unconditionally, so none is.
   */
  theme: {
    /**
     * Everything the preset adds rather than replaces.
     */
    extend: Extensions;
  };
}

/**
 * One set of extensions along a theme's lineage.
 */
interface Level {
  /**
   * The extensions stated at this level.
   */
  extensions: Extensions;

  /**
   * Whether the level came from a theme beneath the one being scoped.
   */
  inherited: boolean;

  /**
   * The name the compiler reports the preset holding this level by.
   */
  name: string | undefined;
}

/**
 * Reports whether a value is a style object.
 */
function isStyles(value: unknown): value is Styles {
  return typeof value === "object" && value !== null;
}

/**
 * Nests styles under a selector, inside each slot where a slot name carries them.
 *
 * @remarks
 *   A slot recipe keys its styles by slot, so the selector goes inside each slot: one wrapping the
 *   map would put slot names where the compiler expects properties.
 */
function nested(held: Styles, slotted: boolean, selector: string): Styles {
  if (!slotted) return { [selector]: held };

  return Object.fromEntries(
    Object.entries(held).map(([slot, styles]) => [
      slot,
      isStyles(styles) ? { [selector]: styles } : styles,
    ]),
  );
}

/**
 * Nests the styles of one compound variant, keeping the axes it matches on as they are.
 */
function nestedCompound(compound: Compound, slotted: boolean, selector: string): Compound {
  const { css, ...axes } = compound;

  return css === undefined ? compound : { ...axes, css: nested(css, slotted, selector) };
}

/**
 * Rewrites one extension so everything it states applies only under a selector.
 */
function scoped(extension: Extension, slotted: boolean, selector: string): Extension {
  const { base, compoundVariants, variants } = extension;

  return {
    ...(base === undefined ? {} : { base: nested(base, slotted, selector) }),
    ...(compoundVariants === undefined
      ? {}
      : {
          compoundVariants: compoundVariants.map((compound) =>
            nestedCompound(compound, slotted, selector),
          ),
        }),
    ...(variants === undefined
      ? {}
      : {
          variants: Object.fromEntries(
            Object.entries(variants).map(([axis, values]) => [
              axis,
              Object.fromEntries(
                Object.entries(values).map(([value, styles]) => [
                  value,
                  nested(styles, slotted, selector),
                ]),
              ),
            ]),
          ),
        }),
  };
}

/**
 * Rewrites every extension in one map so each applies only under a selector.
 */
function all(
  held: Readonly<Record<string, Extension>>,
  slotted: boolean,
  selector: string,
): Record<string, Extension> {
  return Object.fromEntries(
    Object.entries(held).map(([key, extension]) => [key, scoped(extension, slotted, selector)]),
  );
}

/**
 * Nests one node of a composition tree under a selector: a leaf's value is nested, and a group is
 * walked.
 *
 * @remarks
 *   A leaf is a node whose `value` is a style object. A group holds leaves and groups under names,
 *   `DEFAULT` among them, and is walked rather than nested so the compiler still sees the tree.
 *   Anything that is not an object is left as it is.
 */
function composition(node: unknown, selector: string): unknown {
  if (!isStyles(node)) return node;

  const value = node["value"];

  return isStyles(value) ? { ...node, value: { [selector]: value } } : compositions(node, selector);
}

/**
 * Nests every value of a composition tree under a selector.
 */
function compositions(held: Styles, selector: string): Styles {
  return Object.fromEntries(
    Object.entries(held).map(([name, node]) => [name, composition(node, selector)]),
  );
}

/**
 * Rewrites one level's extensions so everything they state applies only under a selector.
 */
function scopedExtensions(extensions: Extensions, selector: string): Extensions {
  const { animationStyles, layerStyles, recipes, slotRecipes, textStyles } = extensions;

  return {
    ...(animationStyles === undefined
      ? {}
      : { animationStyles: compositions(animationStyles, selector) }),
    ...(layerStyles === undefined ? {} : { layerStyles: compositions(layerStyles, selector) }),
    ...(recipes === undefined ? {} : { recipes: all(recipes, false, selector) }),
    ...(slotRecipes === undefined ? {} : { slotRecipes: all(slotRecipes, true, selector) }),
    ...(textStyles === undefined ? {} : { textStyles: compositions(textStyles, selector) }),
  };
}

/**
 * Reports whether a nested preset is one this module can read.
 *
 * @remarks
 *   The compiler also takes a preset by name or as a promise, and a theme nests neither.
 */
function isPreset(held: unknown): held is SwitchablePreset {
  return typeof held === "object" && held !== null;
}

/**
 * Reads every set of extensions a theme carries, its ancestors' first and its own last.
 *
 * @remarks
 *   A derived theme nests its parent's preset beneath its own, and the compiler installs the
 *   nested one first, so an extension the child restates wins over its parent's. The same order
 *   is kept here.
 */
function lineage(preset: SwitchablePreset | undefined, inherited = false): readonly Level[] {
  if (preset === undefined) return [];

  const above = (preset.presets ?? []).flatMap((each) =>
    isPreset(each) ? lineage(each, true) : [],
  );
  const own = preset.theme?.extend;

  return own === undefined ? above : [...above, { extensions: own, inherited, name: preset.name }];
}

/**
 * Builds the presets that make one theme's extensions apply while a page is switched to it.
 *
 * @remarks
 *   One preset per level of the theme's lineage rather than one merged here, so that the compiler
 *   merges them the way it merges the unscoped chain and nothing here restates how. A level that
 *   extends nothing produces no preset.
 * @returns One preset per level that extends anything, oldest ancestor first.
 */
export function scopedPreset(theme: Switchable): readonly ScopedPreset[] {
  const selector = `[${THEME_ATTRIBUTE}=${theme.name}] &`;
  const own = `theme:${theme.name}:switched`;

  return lineage(theme.preset).flatMap(({ extensions, inherited, name }) => {
    const extend = scopedExtensions(extensions, selector);

    if (Object.keys(extend).length === 0) return [];

    return [
      {
        name: inherited ? `${own} from ${name ?? "an unnamed preset"}` : own,
        theme: { extend },
      },
    ];
  });
}

/**
 * Builds the presets that make every theme's extensions switch, the first theme included.
 *
 * @remarks
 *   The first theme's extensions are also in the unscoped rules, which is what makes it the theme
 *   that applies while no attribute is set. Scoping it as well is what lets a subtree inside
 *   another theme switch back to it.
 */
export function scopedPresets(themes: readonly Switchable[]): readonly ScopedPreset[] {
  return themes.flatMap((each) => scopedPreset(each));
}
