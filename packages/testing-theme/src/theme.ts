/**
 * Reads what a theme states: a color resolved through every reference it names, the palettes it
 * fills, the recipes it extends and the font packages it names.
 *
 * @remarks
 *   A theme states a reference where it means a step of a ramp or another semantic token, and a
 *   theme built on another states only what differs. Reading a value therefore follows the
 *   reference through the theme's own tokens and then through the preset the theme is layered on,
 *   which the caller names, because a theme layered on another base resolves against other scales.
 */

import { type Mode, type Preset, type Theme } from "@stealthscale/theme/authoring";

/**
 * Describes the preset a theme is layered on, for the scales a reference names and the theme does
 * not restate.
 */
export interface Resolving {
  /**
   * The preset beneath the theme, or nothing where the theme states every scale itself.
   */
  base?: Preset | undefined;
}

/**
 * Fixes the key a group's own value is written under, which a reference naming the group alone
 * points at.
 */
const ITSELF = "DEFAULT";

/**
 * Reads one key off a value the config types leave loose.
 */
function at(value: unknown, name: string): unknown {
  return typeof value === "object" && value !== null ? Reflect.get(value, name) : undefined;
}

/**
 * Walks a path into a block of tokens, and takes the group's own value where the path stops at a
 * group.
 */
function walked(block: unknown, path: readonly string[]): unknown {
  let node = block;

  for (const name of path) {
    if (node === undefined) return undefined;

    node = at(node, name);
  }

  return node === undefined ? undefined : (at(node, ITSELF) ?? node);
}

/**
 * Reads the color tokens a theme states, or nothing where it states none.
 */
export function colorsOf(theme: Theme): unknown {
  return at(theme.variant.semanticTokens, "colors");
}

/**
 * Finds the token a reference points at: the theme's own ramps first, then its semantic tokens,
 * then the base preset's ramps and semantic tokens.
 *
 * @returns The token, or undefined where the reference names no color token anywhere.
 */
function pointed(theme: Theme, reference: string, base: Preset | undefined): unknown {
  const [category, ...path] = reference.slice(1, -1).split(".");

  if (category !== "colors" || path.length === 0) return undefined;

  const beneath = base?.theme?.extend;

  return (
    walked(at(theme.variant.tokens, "colors"), path) ??
    walked(colorsOf(theme), path) ??
    walked(at(beneath?.tokens, "colors"), path) ??
    walked(at(beneath?.semanticTokens, "colors"), path)
  );
}

/**
 * Reads a token's value in one mode, following every reference to the color it names.
 *
 * @remarks
 *   A reference that comes back round to one already followed stops the walk, so two tokens naming
 *   each other read as a dangling reference rather than as a stack overflow.
 * @returns The color as written, or undefined where the token states no value in that mode or a
 *   reference on the way points nowhere.
 */
export function resolved(
  theme: Theme,
  value: unknown,
  mode: Mode,
  options: Resolving = {},
): string | undefined {
  /**
   * Follows one value, remembering the references already passed on this chain.
   */
  function follow(token: unknown, followed: ReadonlySet<string>): string | undefined {
    const stated = at(token, "value") ?? token;
    const chosen = typeof stated === "object" && stated !== null ? at(stated, mode) : stated;

    if (typeof chosen !== "string") return undefined;
    if (!chosen.startsWith("{")) return chosen;
    if (followed.has(chosen)) return undefined;

    return follow(pointed(theme, chosen, options.base), new Set(followed).add(chosen));
  }

  return follow(value, new Set());
}

/**
 * Fixes the role that makes a group of colors a palette rather than a family of surfaces or inks.
 */
const FILL = "solid";

/**
 * Lists every palette a theme fills, sorted, which is every group of colors with a solid fill.
 */
export function palettesOf(theme: Theme): readonly string[] {
  const colors = colorsOf(theme);

  return Object.keys(typeof colors === "object" && colors !== null ? colors : {})
    .filter((name) => at(at(colors, name), FILL) !== undefined)
    .toSorted();
}

/**
 * Lists the recipe keys a theme's own preset extends, sorted, slot recipes among them.
 */
export function extendedRecipes(theme: Theme): readonly string[] {
  const extend = theme.preset.theme?.extend;

  return [
    ...Object.keys(extend?.recipes ?? {}),
    ...Object.keys(extend?.slotRecipes ?? {}),
  ].toSorted();
}

/**
 * Lists the packages a theme takes its font faces from, sorted.
 */
export function fontsOf(theme: Theme): readonly string[] {
  return [...theme.fonts].toSorted();
}
