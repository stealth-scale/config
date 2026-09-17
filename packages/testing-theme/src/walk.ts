/**
 * Walks every style a recipe writes and reports each string with the property it is written
 * under and the category that property reads.
 */

import { categoryOf } from "#categories.ts";
import { type Declared } from "#recipe.ts";

/**
 * Describes one string a recipe writes, and where.
 */
export interface Written {
  /**
   * The category the nearest property reads, or undefined where no property above reads one.
   */
  category: string | undefined;

  /**
   * The dotted keys from the recipe to the string.
   */
  path: string;

  /**
   * The nearest property above the string, or undefined where there is none.
   */
  property: string | undefined;

  /**
   * The string itself.
   */
  value: string;
}

/**
 * Describes one condition a recipe nests styles under, and where.
 */
export interface Nested {
  /**
   * The condition, as the recipe wrote it, with its underscore.
   */
  condition: string;

  /**
   * The dotted keys from the recipe to the condition.
   */
  path: string;
}

/**
 * Carries everything a walk found.
 */
export interface Walked {
  /**
   * Every condition the recipe nests under.
   */
  conditions: readonly Nested[];

  /**
   * Every string the recipe writes.
   */
  strings: readonly Written[];
}

/**
 * Describes where the walk is: the property and category in force, and the path so far.
 */
interface Site {
  /**
   * The category in force.
   */
  category: string | undefined;

  /**
   * The path so far.
   */
  path: string;

  /**
   * The property in force.
   */
  property: string | undefined;
}

/**
 * Lists the breakpoints, which nest a value without being properties.
 */
const BREAKPOINTS = new Set(["base", "sm", "md", "lg", "xl", "2xl"]);

/**
 * Reports whether a key names a property rather than a condition, a selector, a slot's own
 * value or a breakpoint.
 */
function isProperty(key: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9]*$/u.test(key) && !BREAKPOINTS.has(key);
}

/**
 * Joins one more key onto a path.
 */
function under(path: string, key: string): string {
  return path === "" ? key : `${path}.${key}`;
}

/**
 * Walks one node, collecting into the two lists.
 */
function walk(node: unknown, site: Site, strings: Written[], conditions: Nested[]): void {
  if (typeof node === "string") {
    strings.push({
      category: site.category,
      path: site.path,
      property: site.property,
      value: node,
    });

    return;
  }

  if (typeof node !== "object" || node === null) return;

  for (const [key, child] of Object.entries(node)) {
    const path = under(site.path, key);

    if (key.startsWith("_")) conditions.push({ condition: key, path });

    const property = isProperty(key) ? key : site.property;
    const category = isProperty(key) ? categoryOf(key) : site.category;

    walk(child, { category, path, property }, strings, conditions);
  }
}

/**
 * Reads the styles of one compound variant, or undefined where the entry is not an object.
 */
function cssOf(compound: unknown): unknown {
  return typeof compound === "object" && compound !== null
    ? Reflect.get(compound, "css")
    : undefined;
}

/**
 * Walks everything a recipe writes: its base, its variants, and the styles of its compound
 * variants.
 */
export function walked(recipe: Declared): Walked {
  const base: unknown = recipe.base;
  const compounds = (recipe.compoundVariants ?? []).map((compound) => ({ css: cssOf(compound) }));
  const strings: Written[] = [];
  const conditions: Nested[] = [];

  walk(
    { base, compoundVariants: compounds, variants: recipe.variants },
    { category: undefined, path: "", property: undefined },
    strings,
    conditions,
  );

  return { conditions, strings };
}
