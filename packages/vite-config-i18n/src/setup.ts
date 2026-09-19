/**
 * Finds a foundation's setup file, whether the foundation is a workspace package or an installed
 * one.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * The foundation's own path to the file, which a workspace holds before anything is built.
 */
const SOURCE = ["src", "testing.ts"];

/**
 * The subpath the foundation publishes its setup file under.
 */
const PUBLISHED = "testing";

/**
 * Describes what resolves a specifier, which is a require against the calling module.
 */
export interface Resolving {
  /**
   * Returns the absolute path a specifier resolves to.
   */
  resolve: (specifier: string) => string;
}

/**
 * Returns the setup file a foundation supplies.
 *
 * @remarks
 *   The manifest is resolved rather than the published subpath, because the subpath is built output
 *   and this runs while a task graph is being assembled, which is before anything has been built.
 *   A workspace therefore answers with the source, and an installed copy, which publishes no
 *   source, answers with the built file.
 * @param reading - The require against the calling module, which resolves a specifier.
 * @param foundation - The package name the setup file is published by.
 * @returns The absolute path of the setup file.
 */
export function setupIn(reading: Resolving, foundation: string): string {
  const source = join(dirname(reading.resolve(`${foundation}/package.json`)), ...SOURCE);

  return existsSync(source) ? source : reading.resolve(`${foundation}/${PUBLISHED}`);
}
