/**
 * Compares the block table in a package's README against the namespaces its barrel exports.
 *
 * @remarks
 *   The README is scanned as lines rather than parsed as Markdown, so a table inside a fenced
 *   example counts as the table. A package with no README, or one whose README names no blocks,
 *   is left alone.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Matches the heading the block table sits under.
 */
const HEADING = /^#{1,6} .*\bBlocks\b/u;

/**
 * Matches any heading, which is where the search for that table stops.
 */
const ANY_HEADING = /^#{1,6} /u;

/**
 * Collects the body rows of the first table under a heading.
 *
 * @remarks
 *   The scan ends at the next heading, or at the first line after the table that is not a row.
 *   The header and divider rows are dropped. Undefined means the heading stands with no table
 *   beneath it.
 */
function tableAfter(lines: readonly string[], heading: number): readonly string[] | undefined {
  const rows: string[] = [];

  for (const line of lines.slice(heading + 1)) {
    if (ANY_HEADING.test(line)) break;
    if (line.startsWith("|")) rows.push(line);
    else if (rows.length > 0) break;
  }

  return rows.length === 0 ? undefined : rows.slice(2);
}

/**
 * Takes the first cell of a table row, stripped of its backticks.
 *
 * @remarks
 *   The row is split on every pipe it holds, so a cell containing an escaped pipe reads short.
 */
function first(row: string): string {
  return row.split("|").slice(1, 2).join("").trim().replaceAll("`", "");
}

/**
 * Reports a block the README names that the barrel lacks, and a namespace the table leaves out.
 *
 * @remarks
 *   Only top-level namespaces are compared, so a function exported beside them is not expected in
 *   the table. A README missing the heading documents nothing and breaks nothing.
 */
export function exports(at: string, namespaces: readonly string[]): readonly string[] {
  const path = join(at, "README.md");

  if (!existsSync(path)) return [];

  const lines = readFileSync(path, "utf8").split("\n");
  const heading = lines.findIndex((line) => HEADING.test(line));

  if (heading === -1) return [];

  const rows = tableAfter(lines, heading);

  if (rows === undefined) return ["README has a Blocks heading with no table under it"];

  const named = rows.map((row) => first(row));

  return [
    ...named
      .filter((name) => !namespaces.includes(name))
      .map((name) => `README names a block ${name} that the barrel does not export`),
    ...namespaces
      .filter((name) => !named.includes(name))
      .map((name) => `README does not name the block ${name}`),
  ];
}
