/**
 * Reads what the scheme needs from the compiler's resolved configuration: every recipe with its
 * class, its axes and its slots, and the separator.
 *
 * @remarks
 *   The driver's `config` is the configuration the native compiler received, with every preset
 *   merged, and it is typed as a record of unknown values. Each field is read behind a guard. A
 *   recipe without a class name takes its key, as the runtime does, and a missing separator is the
 *   compiler's default, `_`.
 */

import { type CompilerConfig, type Recipe, type Separator } from "@stealthscale/pandacss-naming";

import { type SerializedConfig } from "#pandacss.ts";

/**
 * The separator the compiler uses where the configuration sets none.
 */
const DEFAULT_SEPARATOR: Separator = "_";

/**
 * Lists the separators the compiler accepts.
 */
const SEPARATORS: ReadonlySet<string> = new Set<Separator>(["_", "=", "-"]);

/**
 * The theme field the recipes are declared under.
 */
const RECIPES = "recipes";

/**
 * The theme field the slot recipes are declared under.
 */
const SLOT_RECIPES = "slotRecipes";

/**
 * Tells whether a value is a plain object, which a configuration field is when it is set.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Tells whether a value is one of the separators the compiler accepts.
 */
function isSeparator(value: unknown): value is Separator {
  return typeof value === "string" && SEPARATORS.has(value);
}

/**
 * Reads the strings of a list, or nothing where the value is not a list.
 */
function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const list: unknown[] = value;

  return list.filter((each): each is string => typeof each === "string");
}

/**
 * Reads one recipe definition as the scheme sees it.
 */
function recipeOf(key: string, definition: unknown, slotted: boolean): Recipe {
  const fields = isRecord(definition) ? definition : {};
  const name = fields["className"];
  const variants = fields["variants"];
  const className = typeof name === "string" ? name : key;
  const axes = isRecord(variants) ? Object.keys(variants) : [];

  return slotted ? { axes, className, slots: strings(fields["slots"]) } : { axes, className };
}

/**
 * Reads every recipe declared under one theme field.
 */
function recipesOf(
  theme: Readonly<Record<string, unknown>>,
  field: string,
  slotted: boolean,
): Recipe[] {
  const definitions = theme[field];

  if (!isRecord(definitions)) return [];

  return Object.entries(definitions).map(([key, definition]) => recipeOf(key, definition, slotted));
}

/**
 * Reads the recipes and the separator out of the compiler's resolved configuration.
 *
 * @param config - The driver's `config`, with every preset merged.
 * @returns Every recipe under `theme.recipes`, then every slot recipe under `theme.slotRecipes`,
 *   and the separator, `_` where the configuration sets none.
 */
export function compilerConfig(config: SerializedConfig): CompilerConfig {
  const theme = config["theme"];
  const separator = config["separator"];
  const fields = isRecord(theme) ? theme : {};

  return {
    recipes: [...recipesOf(fields, RECIPES, false), ...recipesOf(fields, SLOT_RECIPES, true)],
    separator: isSeparator(separator) ? separator : DEFAULT_SEPARATOR,
  };
}
