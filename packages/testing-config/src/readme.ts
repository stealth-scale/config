/**
 * Checks that the block table in a README names the namespaces the barrel exports.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The heading that introduces the block table.
 */
const HEADING = /^#{1,6} .*\bBlocks\b/u;

/**
 * Any heading. The search for the table stops at the first one after the block heading.
 */
const ANY_HEADING = /^#{1,6} /u;

/**
 * Finds the first table under a heading.
 *
 * @param lines - The README, one line per entry.
 * @param heading - The index of the heading line.
 * @returns The body rows of the table, without the header row and the rule, or `undefined` when
 *   no table follows the heading.
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
 * Reads the first cell of a table row, without its code marks.
 *
 * @param row - The table row.
 * @returns The text of the first cell.
 */
function first(row: string): string {
  return row.split("|").slice(1, 2).join("").trim().replaceAll("`", "");
}

/**
 * Checks the block table in a README against the namespaces the barrel exports.
 *
 * The table is the first one under a heading that contains the word `Blocks`, and its first
 * column is read as the namespace names. A README without such a heading passes, because the
 * check is about drift between a table and a barrel and not about having a table.
 *
 * @param at - The package directory.
 * @param namespaces - The namespaces the barrel exports.
 * @returns Each violation.
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
