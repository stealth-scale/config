/**
 * Pairs every source file under a package's `src` with the specification beside it.
 *
 * @remarks
 *   The pairing is by path rather than by what a specification imports, so a file whose cases were
 *   folded into a sibling's specification reads as uncovered. That is the point: a reader opening a
 *   source file finds its cases in one place, and a file nobody wrote cases for is visible without
 *   reading any of them.
 */

import { existsSync, globSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

/**
 * The files a package's sources are found in.
 */
const SOURCES = "src/**/*.{ts,tsx}";

/**
 * The suffixes a file carries when it is not itself a source.
 */
const APART = [".spec.ts", ".spec.tsx", ".fixtures.ts", ".fixtures.tsx", ".d.ts"];

/**
 * The files a barrel is named, which gather a block rather than declare one.
 */
const BARRELS = new Set(["index.ts", "index.tsx"]);

/**
 * The suffixes a specification may carry, whichever suffix its source has.
 */
const BESIDE = [".spec.ts", ".spec.tsx"];

/**
 * Matches a line that exports something.
 */
const EXPORTS = /^export\b/mu;

/**
 * Matches a line that exports a type and nothing that survives compilation.
 */
const EXPORTS_TYPE = /^export type\b/mu;

/**
 * Tells whether a path is a source rather than a specification or a fixture, and rather than a
 * barrel unless barrels count.
 */
function named(path: string, barrels: boolean): boolean {
  const file = basename(path);

  return !APART.some((one) => file.endsWith(one)) && (barrels || !BARRELS.has(file));
}

/**
 * Tells whether a file contributes anything a specification could run.
 *
 * @remarks
 *   A module whose every export is an `export type` compiles to nothing, so there is no behaviour
 *   to write cases against. The test reads the text rather than the syntax tree, which is enough
 *   because an export written any other way puts a value in the output.
 */
function declares(at: string, path: string): boolean {
  const held = readFileSync(join(at, path), "utf8");
  const exported = held.split("\n").filter((line) => EXPORTS.test(line));

  return exported.length === 0 || !exported.every((line) => EXPORTS_TYPE.test(line));
}

/**
 * Reports every source file with no specification beside it.
 *
 * @remarks
 *   A barrel is left alone unless the package asks for barrels. It re-exports what the files
 *   around it declare, and the conformance specification every package already runs is what
 *   reads a barrel. A component package asks for barrels, because a barrel there is where a
 *   component's public surface is written and where a recipe or a binding leaks out. A fixture,
 *   a declaration file and a module exporting types alone are left alone in every package, since
 *   none of them holds behaviour of its own.
 * @param at - The directory holding the package's manifest.
 * @param barrels - Whether a barrel needs a specification beside it too.
 * @returns One violation per source file with no specification, or an empty array.
 */
export function specs(at: string, barrels = false): readonly string[] {
  const found = globSync(SOURCES, { cwd: at }).filter(
    (path) => named(path, barrels) && declares(at, path),
  );

  return found
    .filter((path) => !BESIDE.some((one) => existsSync(join(at, path.replace(/\.tsx?$/u, one)))))
    .toSorted()
    .map((path) => `${path} has no specification beside it`);
}
