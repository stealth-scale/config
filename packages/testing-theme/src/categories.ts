/**
 * Reads the vocabulary a recipe is checked against: which category each property takes its value
 * from, which conditions exist, and which token paths each category defines.
 *
 * @remarks
 *   The categories are read from the compiler's base preset rather than copied, and the tokens
 *   and conditions from the preset the recipe is written against, which is the foundation unless
 *   a specification names another. The three compositions and the virtual palette are the
 *   compiler's own, which no utility declares, so those four are named here.
 */

import base from "@pandacss/preset-base";

import { type Preset } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { leaves } from "#tokens.ts";

/**
 * Maps the properties the compiler resolves itself, which no utility declares, to the categories
 * they read: the three compositions and the virtual palette.
 */
const COMPOSITIONS: Readonly<Record<string, string>> = {
  animationStyle: "animationStyles",
  colorPalette: "colors",
  layerStyle: "layerStyles",
  textStyle: "textStyles",
};

/**
 * Fixes the key a group's own value is written under, which a recipe leaves out of the path.
 */
const ITSELF = ".DEFAULT";

/**
 * Describes the one thing read off a utility: the category its values come from.
 */
interface Utility {
  /**
   * The property's other names.
   */
  shorthand?: string | string[] | undefined;

  /**
   * The category, as a name or as a function that asks the theme for one.
   */
  values?: unknown;
}

/**
 * Describes a utility's values written as a function that asks the theme for a category.
 */
type Asking = (theme: (category: string) => Record<string, string>) => unknown;

/**
 * Reports whether a utility's values are a function that asks the theme.
 */
function isAsking(values: unknown): values is Asking {
  return typeof values === "function";
}

/**
 * Lists the categories one utility takes its values from.
 *
 * @remarks
 *   A utility names its category outright, or asks the theme for it inside a function that adds
 *   values of its own. The function is called with a theme that records what it was asked for and
 *   returns nothing, which is every category the utility reads.
 */
function categoriesOf(utility: Utility): readonly string[] {
  if (typeof utility.values === "string") return [utility.values];
  if (!isAsking(utility.values)) return [];

  const asked: string[] = [];

  utility.values((category) => {
    asked.push(category);

    return {};
  });

  return asked;
}

/**
 * Carries what the compiler's base preset says about properties.
 */
interface Vocabulary {
  /**
   * Every property and shorthand that reads a token, against the category it reads.
   */
  categories: ReadonlyMap<string, string>;

  /**
   * Every property and shorthand the compiler resolves, whether or not it reads a token.
   */
  properties: ReadonlySet<string>;
}

/**
 * Lists a utility's names: the property and every shorthand it answers to.
 */
function namesOf(property: string, utility: Utility): readonly string[] {
  const shorthand = utility.shorthand ?? [];

  return [property, ...(typeof shorthand === "string" ? [shorthand] : shorthand)];
}

/**
 * Reads the base preset's utilities into the two lookups.
 */
function read(): Vocabulary {
  const categories = new Map<string, string>(Object.entries(COMPOSITIONS));
  const properties = new Set<string>(Object.keys(COMPOSITIONS));

  for (const [property, utility] of Object.entries({ ...base.utilities })) {
    const names = namesOf(property, { ...utility });
    const [category] = categoriesOf({ ...utility });

    for (const name of names) {
      properties.add(name);

      if (category !== undefined) categories.set(name, category);
    }
  }

  return { categories, properties };
}

/**
 * Caches the two lookups, once something has asked for them.
 */
let vocabulary: undefined | Vocabulary;

/**
 * Reads the vocabulary, building it on the first ask.
 *
 * @remarks
 *   Built on the first ask rather than on import, because a specification that reads only the
 *   classes a recipe emits pays for the whole utility map otherwise.
 */
function known(): Vocabulary {
  vocabulary ??= read();

  return vocabulary;
}

/**
 * Reads the category a property takes its value from, or undefined for a property that reads no
 * token.
 */
export function categoryOf(property: string): string | undefined {
  return known().categories.get(property);
}

/**
 * Reports whether a key names a property the compiler resolves, rather than a condition, a
 * selector, a slot or a breakpoint.
 *
 * @remarks
 *   The compiler derives a condition from each breakpoint, `smDown` and `smToLg` beside `sm`, so a
 *   list of breakpoint names written here would go stale the moment a theme states one more. What
 *   the compiler resolves as a property is the list that cannot.
 */
export function isProperty(key: string): boolean {
  return known().properties.has(key);
}

/**
 * Lists every condition a recipe can nest under: the base preset's and the preset's own.
 *
 * @param preset - The preset the recipe is written against, the foundation unless named.
 */
export function conditionNames(preset: Preset = foundation): ReadonlySet<string> {
  return new Set(Object.keys({ ...base.conditions, ...preset.conditions?.extend }));
}

/**
 * Caches the token paths of each category, per preset.
 */
const PATHS = new WeakMap<Preset, Map<string, ReadonlySet<string>>>();

/**
 * Lists every path one block of tokens defines, with a group's own value reachable without its
 * `DEFAULT` suffix.
 */
function pathsIn(block: unknown): readonly string[] {
  return leaves(block).flatMap(({ path }) =>
    path.endsWith(ITSELF) ? [path, path.slice(0, -ITSELF.length)] : [path],
  );
}

/**
 * Reads the cache of one preset, creating it on the first read.
 */
function cacheOf(preset: Preset): Map<string, ReadonlySet<string>> {
  const found = PATHS.get(preset);

  if (found !== undefined) return found;

  const created = new Map<string, ReadonlySet<string>>();

  PATHS.set(preset, created);

  return created;
}

/**
 * Lists every token path a preset defines in a category: the reference tokens, the semantic
 * tokens and the compositions under that name.
 *
 * @remarks
 *   The preset is the one the recipe is written against, which is the foundation unless named.
 */
export function tokenPaths(category: string, preset: Preset = foundation): ReadonlySet<string> {
  const cache = cacheOf(preset);
  const cached = cache.get(category);

  if (cached !== undefined) return cached;

  const extend = { ...preset.theme?.extend };
  const paths = new Set([
    ...pathsIn(Reflect.get({ ...extend.tokens }, category)),
    ...pathsIn(Reflect.get({ ...extend.semanticTokens }, category)),
    ...pathsIn(Reflect.get(extend, category)),
  ]);

  cache.set(category, paths);

  return paths;
}

/**
 * Fixes the key the semantic colors are cached under, beside the categories.
 */
const SEMANTIC_COLORS = "semanticTokens.colors";

/**
 * Lists every semantic color path a preset defines, which is every color a recipe may name: a
 * family member, a palette role, and nothing from the ramps.
 *
 * @param preset - The preset the recipe is written against, the foundation unless named.
 */
export function semanticColorPaths(preset: Preset = foundation): ReadonlySet<string> {
  const cache = cacheOf(preset);
  const cached = cache.get(SEMANTIC_COLORS);

  if (cached !== undefined) return cached;

  const paths = new Set(pathsIn(preset.theme?.extend?.semanticTokens?.colors));

  cache.set(SEMANTIC_COLORS, paths);

  return paths;
}
