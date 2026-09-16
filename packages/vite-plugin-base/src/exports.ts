/**
 * Reads the target an export map names for a subpath, under a set of conditions.
 *
 * @remarks
 *   A plugin reads an export map where it has to name a file rather than import it: to write a
 *   path into a generated file, or to load a package's own subpath from inside that package, which
 *   an import by name does not resolve.
 */

import { type Manifest } from "#reached.ts";

/**
 * Picks the target of one export map entry, the way a resolver does.
 *
 * @remarks
 *   A string is the target. An object is read for the first of the conditions it holds, in the
 *   order given, and for `default` after them, and what is found is read the same way, so a
 *   condition nested under another resolves.
 */
function target(entry: unknown, conditions: readonly string[]): string | undefined {
  if (typeof entry === "string") return entry;
  if (typeof entry !== "object" || entry === null) return undefined;

  for (const condition of [...conditions, "default"]) {
    if (condition in entry) return target(Reflect.get(entry, condition), conditions);
  }

  return undefined;
}

/**
 * Finds the file a manifest publishes a subpath as, under the conditions given.
 *
 * @remarks
 *   The two short forms of an export map are read as Node reads them: a string names the `.`
 *   subpath, and an object whose keys are conditions rather than subpaths describes `.` alone.
 * @returns The target as the manifest writes it, such as `./src/index.ts`, or undefined where the
 *   manifest publishes no such subpath under those conditions.
 */
export function exportTarget(
  manifest: Manifest,
  subpath: string,
  conditions: readonly string[] = [],
): string | undefined {
  const exports = manifest["exports"];

  if (typeof exports === "string") return subpath === "." ? exports : undefined;
  if (typeof exports !== "object" || exports === null) return undefined;

  const keyed = Object.keys(exports).some((key) => key.startsWith("."));

  if (keyed) return target(Reflect.get(exports, subpath), conditions);

  return subpath === "." ? target(exports, conditions) : undefined;
}
