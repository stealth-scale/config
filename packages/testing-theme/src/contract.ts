/**
 * Checks a theme against the contract a type cannot hold it to: a role stated in one mode, a
 * reference that points nowhere, an extension aimed at a recipe nobody publishes, a compound the
 * runtime never applies, an extension file the theme does not list, and a style with nothing in
 * it.
 */

import { existsSync } from "node:fs";

import {
  BACKGROUNDS,
  BORDERS,
  compoundClassName,
  FOREGROUNDS,
  MODES,
  ROLES,
  STATUSES,
  type Theme,
} from "@stealthscale/theme/authoring";

import { extensionFiles } from "#files.ts";
import { type Declared } from "#recipe.ts";
import { colorsOf, extendedRecipes, palettesOf, resolved, type Resolving } from "#theme.ts";
import { leaves, nodeAt, stated } from "#tokens.ts";

/**
 * Fixes the prefix the compiler writes before a compound's selection in its class.
 */
const COMPOUND = "--compound__";

/**
 * Lists the three families against the members each states.
 */
const FAMILIES: ReadonlyArray<readonly [family: string, members: readonly string[]]> = [
  ["bg", [...BACKGROUNDS, ...STATUSES]],
  ["border", [...BORDERS, ...STATUSES]],
  ["fg", [...FOREGROUNDS, ...STATUSES]],
];

/**
 * Lists the two keys an extension may never name.
 */
const OWNED = ["className", "slots"];

/**
 * Lists the three kinds of composition a theme states.
 */
const COMPOSITIONS = ["animationStyles", "layerStyles", "textStyles"] as const;

/**
 * Reports a palette that leaves one of the twelve roles out, and a family that leaves one of its
 * members out.
 */
export function roles(theme: Theme): readonly string[] {
  const colors = colorsOf(theme);
  const missing: string[] = [];

  for (const palette of palettesOf(theme)) {
    for (const role of ROLES) {
      if (!stated(nodeAt(colors, palette), role)) {
        missing.push(`${theme.name} ${palette}.${role} is not stated`);
      }
    }
  }

  for (const [family, members] of FAMILIES) {
    const group = nodeAt(colors, family);

    if (group === undefined) continue;

    for (const member of members) {
      if (!stated(group, member)) missing.push(`${theme.name} ${family}.${member} is not stated`);
    }
  }

  return missing;
}

/**
 * Reports a color stated in one mode and not the other.
 *
 * @remarks
 *   A color stated once as a string covers both modes, and a reference inherits both from the
 *   token it names, so only a pair with one side missing is reported.
 */
export function modes(theme: Theme): readonly string[] {
  return leaves(colorsOf(theme)).flatMap(({ path, value }) => {
    if (typeof value !== "object" || value === null) return [];

    const missing = MODES.filter((mode) => !(mode in value));

    return missing.length === MODES.length || missing.length === 0
      ? []
      : missing.map((mode) => `${theme.name} ${path} is not stated in ${mode}`);
  });
}

/**
 * Reports a reference that points at a token nothing defines, or at itself.
 */
export function references(theme: Theme, options: Resolving): readonly string[] {
  return leaves(colorsOf(theme)).flatMap(({ path, value }) =>
    MODES.flatMap((mode) => {
      const written: unknown =
        typeof value === "object" && value !== null ? Reflect.get(value, mode) : value;

      if (typeof written !== "string" || !written.startsWith("{")) return [];
      if (resolved(theme, { value }, mode, options) !== undefined) return [];

      return [`${theme.name} ${path} in ${mode} names ${written}, which nothing defines`];
    }),
  );
}

/**
 * Reports an extension that names a recipe key the workspace does not publish, or that names one
 * of the two keys the component owns.
 *
 * @remarks
 *   The keys the workspace publishes are the caller's to state. Left unstated, the keys go
 *   unchecked and the two owned keys are still refused.
 */
export function extensions(theme: Theme, recipes?: readonly string[]): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const named = Object.entries({ ...extend?.recipes, ...extend?.slotRecipes });

  return named.flatMap(([key, extension]) => {
    const unpublished =
      recipes === undefined || recipes.includes(key)
        ? []
        : [`${theme.name} extends ${key}, which no package publishes`];
    const owned = OWNED.filter((field) => field in extension).map(
      (field) => `${theme.name} extends ${key} with ${field}, which the component owns`,
    );

    return unpublished.concat(owned);
  });
}

/**
 * Writes a compound's selection in the compiler's scheme, or undefined for an entry that is not an
 * object.
 *
 * @throws {@link Error} When the compound matches an axis on a value a class name cannot carry.
 */
function selectionOf(compound: unknown): string | undefined {
  return typeof compound === "object" && compound !== null
    ? compoundClassName("", compound).slice(COMPOUND.length)
    : undefined;
}

/**
 * Reports a theme's compound for a selection the recipe declares no compound for, and a compound
 * matched on a value a class name cannot carry.
 *
 * @remarks
 *   The runtime takes a compound's class from the component's recipe alone, so a theme's compound
 *   reaches an element only where the recipe declares the same selection. Any other compound is
 *   compiled and never applied. A key the map leaves out goes unchecked here, and the extensions
 *   check reports it.
 */
export function compounds(
  theme: Theme,
  recipes: Readonly<Record<string, Declared>>,
): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const named = Object.entries({ ...extend?.recipes, ...extend?.slotRecipes });

  return named.flatMap(([key, extension]) => {
    const recipe = recipes[key];

    if (recipe === undefined) return [];

    const declared = new Set(
      (recipe.compoundVariants ?? []).map((compound) => selectionOf(compound)),
    );

    return (extension.compoundVariants ?? []).flatMap((compound) => {
      try {
        const selection = selectionOf(compound);

        return selection === undefined || declared.has(selection)
          ? []
          : [
              `${theme.name} extends ${key} with a compound for ${selection}, which the recipe does not declare`,
            ];
      } catch {
        return [
          `${theme.name} extends ${key} with a compound matched on a value a class name cannot carry`,
        ];
      }
    });
  });
}

/**
 * Reports an extension file under the theme's source directory that the theme does not list.
 */
export function listed(theme: Theme, at: string): readonly string[] {
  if (!existsSync(at)) return [`${theme.name} has no source directory at ${at}`];

  const keys = extendedRecipes(theme);

  return extensionFiles(at)
    .filter((file) => !keys.includes(file.key))
    .map((file) => `${theme.name} does not list ${file.file}`);
}

/**
 * Reports a text, layer or animation style that states nothing, and a text style without a size.
 */
export function styles(theme: Theme): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const empty = COMPOSITIONS.flatMap((kind) =>
    leaves(extend?.[kind]).flatMap(({ path, value }) =>
      typeof value === "object" && value !== null && Object.keys(value).length > 0
        ? []
        : [`${theme.name} ${kind}.${path} states nothing`],
    ),
  );
  const unsized = leaves(extend?.textStyles).flatMap(({ path, value }) =>
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length > 0 &&
    !("fontSize" in value)
      ? [`${theme.name} textStyles.${path} states no fontSize`]
      : [],
  );

  return empty.concat(unsized);
}
