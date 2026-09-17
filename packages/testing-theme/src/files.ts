/**
 * Lists the recipe files and the extension files under a package's source, read as text.
 *
 * @remarks
 *   A file is read for the line that exports its recipe or its extension rather than imported, so
 *   a specification about a preset never evaluates a recipe, and a file that exports neither is
 *   passed over.
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

import { camelCased } from "#tokens.ts";

/**
 * Describes one recipe file under a component package's source.
 */
export interface RecipeFile {
  /**
   * The file, relative to the directory searched.
   */
  file: string;

  /**
   * The key the preset lists the recipe under, which is the file name in camel case.
   */
  key: string;

  /**
   * Whether the file defines a slot recipe.
   */
  slotted: boolean;
}

/**
 * Describes one extension file under a theme package's source.
 */
export interface ExtensionFile {
  /**
   * The file, relative to the directory searched.
   */
  file: string;

  /**
   * The key the theme lists the extension under, which is the file name in camel case.
   */
  key: string;
}

/**
 * Matches the line a recipe file exports its recipe on.
 */
const RECIPE = /^export const recipe = define(?<kind>Slot)?Recipe\(/mu;

/**
 * Matches the line an extension file exports its extension on.
 */
const EXTENSION = /^export const extension\b/mu;

/**
 * Fixes the suffix a recipe file carries.
 */
const RECIPE_SUFFIX = ".recipe.ts";

/**
 * Lists the two directories a theme keeps its extensions in.
 */
const EXTENSION_DIRECTORIES = ["recipes", "slot-recipes"];

/**
 * Lists every source file under a directory, relative to it, specifications left out.
 */
function sourcesUnder(at: string): readonly string[] {
  try {
    return readdirSync(at, { recursive: true, withFileTypes: true })
      .filter(
        (entry) => entry.isFile() && entry.name.endsWith(".ts") && !entry.name.includes(".spec."),
      )
      .map((entry) => relative(at, join(entry.parentPath, entry.name)))
      .toSorted();
  } catch {
    return [];
  }
}

/**
 * Lists every recipe file under a directory: a file named `*.recipe.ts` that exports `recipe`.
 */
export function recipeFiles(at: string): readonly RecipeFile[] {
  return sourcesUnder(at)
    .filter((file) => file.endsWith(RECIPE_SUFFIX))
    .flatMap((file) => {
      const found = RECIPE.exec(readFileSync(join(at, file), "utf8"));

      if (found === null) return [];

      return [
        {
          file,
          key: camelCased(basename(file, RECIPE_SUFFIX)),
          slotted: found.groups?.["kind"] === "Slot",
        },
      ];
    });
}

/**
 * Lists every extension file under a theme's source: a file under `recipes/` or `slot-recipes/`
 * that exports `extension`.
 */
export function extensionFiles(at: string): readonly ExtensionFile[] {
  return EXTENSION_DIRECTORIES.flatMap((directory) =>
    sourcesUnder(join(at, directory)).flatMap((file) => {
      if (!EXTENSION.test(readFileSync(join(at, directory, file), "utf8"))) return [];

      return [{ file: join(directory, file), key: camelCased(basename(file, ".ts")) }];
    }),
  );
}
