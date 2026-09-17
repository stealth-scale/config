/**
 * Checks that every font package a theme names is installed where the theme is.
 */

import { createRequire } from "node:module";
import { join } from "node:path";

import { type Theme } from "@stealthscale/theme/authoring";

/**
 * Reports whether a package resolves from a directory, by its entry or by its manifest.
 *
 * @remarks
 *   A font package may publish a stylesheet and no entry, so its manifest is tried where the entry
 *   is not found.
 */
function resolves(name: string, from: string): boolean {
  const require = createRequire(join(from, "package.json"));

  for (const specifier of [name, `${name}/package.json`]) {
    try {
      require.resolve(specifier);

      return true;
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * Reports a font package the theme names that does not resolve from the theme package's own
 * directory.
 *
 * @remarks
 *   Nothing is reported where no directory is given, as the listing check does. Resolving from the
 *   working directory instead would answer differently depending on where the run was started.
 */
export function installed(theme: Theme, at?: string): readonly string[] {
  if (at === undefined) return [];

  return theme.fonts
    .filter((name) => !resolves(name, at))
    .map((name) => `${theme.name} names ${name}, which does not resolve from ${at}`);
}
