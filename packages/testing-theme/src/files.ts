/**
 * Lists the recipe files and the extension files under a package's source, read as text.
 *
 * @remarks
 *   A file is read for the line that exports its recipe or its extension rather than imported, so
 *   a specification about a preset never evaluates a recipe, and a file that exports neither is
 *   passed over.
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

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
   * The key the preset lists the recipe under: the file's name in camel case, or the directory's
   * where the file is named `recipe.ts`.
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
 *
 * @remarks
 *   The name alone, because the definition may carry a type and may be written on the next line.
 *   Matching the definition as well left such a file unread, and the preset check then reported
 *   the registered key as backed by no file and passed over a second recipe file.
 */
const RECIPE = /^export const recipe\b/mu;

/**
 * Matches the call a slot recipe is defined by, wherever the file writes it.
 */
const SLOTTED = /\bdefineSlotRecipe\s*\(/u;

/**
 * Matches the line an extension file exports its extension on.
 */
const EXTENSION = /^export const extension\b/mu;

/**
 * Fixes the suffix a recipe file carries where it is named for its recipe.
 */
const RECIPE_SUFFIX = ".recipe.ts";

/**
 * Fixes the name a recipe file carries where its directory is named for its recipe.
 */
const RECIPE_FILE = "recipe.ts";

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
 * Reports whether a file is named as a recipe file, by its suffix or by its bare name.
 */
function isRecipeFile(file: string): boolean {
  return file.endsWith(RECIPE_SUFFIX) || basename(file) === RECIPE_FILE;
}

/**
 * Writes the key a recipe file registers under: its own name, or its directory's where the file
 * is named `recipe.ts`.
 */
function keyOf(file: string): string {
  const name = basename(file);

  return camelCased(name === RECIPE_FILE ? basename(dirname(file)) : basename(file, RECIPE_SUFFIX));
}

/**
 * Lists every recipe file under a directory: a file named `*.recipe.ts` or `recipe.ts` that
 * exports `recipe`.
 */
export function recipeFiles(at: string): readonly RecipeFile[] {
  return sourcesUnder(at)
    .filter((file) => isRecipeFile(file))
    .flatMap((file) => {
      const source = readFileSync(join(at, file), "utf8");

      if (!RECIPE.test(source)) return [];

      return [{ file, key: keyOf(file), slotted: SLOTTED.test(source) }];
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
