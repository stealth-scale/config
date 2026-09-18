/**
 * Resolves the patterns to the files they match and to the directories a watcher has to cover.
 */

import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizePath } from "vite";

import { type Source } from "#contract.ts";

/**
 * Matches a path segment that holds a glob wildcard.
 */
const WILDCARD = /[*?[{]/u;

/**
 * Reads every file the patterns match.
 *
 * @remarks
 *   Sorted rather than left in file system order, so two machines building one tree generate the
 *   same module. Paths are absolute and forward-slashed, which is the form Vite reports a changed
 *   file in.
 * @returns Each file with its text, sorted by path.
 * @throws {@link Error} When the patterns together match no file.
 */
export function found(root: string, patterns: readonly string[]): readonly Source[] {
  const paths = [...new Set(globSync([...patterns], { cwd: root }))].toSorted();

  if (paths.length === 0) {
    throw new Error(`specimen: ${patterns.join(", ")} matched no file under ${root}`);
  }

  return paths.map((path) => {
    const absolute = normalizePath(resolve(root, path));

    return { path: absolute, text: readFileSync(absolute, "utf8") };
  });
}

/**
 * Returns the directory a pattern starts searching in.
 *
 * @remarks
 *   A dev server watches its own root and nothing above it. A catalogue's specimens sit beside the
 *   application rather than under it, so a file appearing there is only detected when its directory
 *   is watched explicitly.
 * @returns The leading segments before the first wildcard, relative to the root, and `.` for a
 *   pattern that opens with one.
 */
export function under(pattern: string): string {
  const segments: string[] = [];

  for (const segment of pattern.split("/")) {
    if (WILDCARD.test(segment)) break;

    segments.push(segment);
  }

  return segments.length === 0 ? "." : segments.join("/");
}

/**
 * Resolves each pattern's starting directory against the root.
 *
 * @returns The absolute directories, each one once.
 */
export function roots(root: string, patterns: readonly string[]): readonly string[] {
  return [...new Set(patterns.map((pattern) => normalizePath(resolve(root, under(pattern)))))];
}
