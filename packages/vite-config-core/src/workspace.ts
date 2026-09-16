/**
 * Finds the globs a repository declares for its workspace, whichever package manager wrote them.
 *
 * @remarks
 *   The only caller wants to know whether a directory is a workspace root, so
 *   the globs are never matched against anything here. A repository declaring
 *   no package is still a root, and reports an empty list rather than nothing.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * One package manager's way of declaring a workspace.
 *
 * @remarks
 *   Undefined means this manager is not the one in use, and the next reader is
 *   asked. An empty array means it is in use and declares no package, which
 *   stops the search.
 */
type Reader = (
  at: string,
  manifest: Readonly<Record<string, unknown>>,
) => readonly string[] | undefined;

/**
 * Keeps the entries that are strings and drops the rest.
 */
function names(held: readonly unknown[]): readonly string[] {
  return held.filter((one): one is string => typeof one === "string");
}

/**
 * Reads the workspace npm, yarn and bun each declare in the manifest.
 *
 * @remarks
 *   Both spellings are accepted: the bare array, and the object holding a
 *   `packages` array that yarn's classic form uses. A field of any other shape
 *   still marks the directory as a root, and declares no package.
 */
function declared(
  at: string,
  manifest: Readonly<Record<string, unknown>>,
): readonly string[] | undefined {
  const stated = manifest["workspaces"];

  if (stated === undefined) return undefined;

  if (Array.isArray(stated)) return names(stated);

  const held: unknown =
    typeof stated === "object" && stated !== null ? Reflect.get(stated, "packages") : undefined;

  return Array.isArray(held) ? names(held) : [];
}

/**
 * Strips a trailing comment and a surrounding pair of quotes from a YAML scalar.
 *
 * @remarks
 *   The quotes have to match each other, and a comment is only recognised where
 *   whitespace precedes the hash, so a glob containing one survives.
 */
function unquoted(held: string): string {
  const bare = held
    .trim()
    .replace(/\s+#.*$/u, "")
    .trim();

  return /^(?<quote>["'])(?<held>.*)\k<quote>$/u.exec(bare)?.groups?.["held"] ?? bare;
}

/**
 * Reads the globs from a `packages:` key written inline as a flow sequence.
 *
 * @remarks
 *   Undefined means the line is not in flow form and the block form should be
 *   tried instead. An entry that is empty after unquoting is dropped, which is
 *   what a trailing comma leaves behind.
 */
function flowing(line: string): readonly string[] | undefined {
  const held = /^packages:\s*\[(?<held>.*)\]/u.exec(line)?.groups?.["held"];

  if (held === undefined) return undefined;

  return held
    .split(",")
    .map((one) => unquoted(one))
    .filter((one) => one !== "");
}

/**
 * Collects the dashed entries below a `packages:` key.
 *
 * @remarks
 *   Reading stops at the first line that is neither an entry, a comment nor
 *   blank, which is how the next top-level key ends the list. Indentation is
 *   not measured, so a nested sequence elsewhere in the file would be read as
 *   part of this one.
 * @param lines - The lines after the `packages:` key, in file order.
 */
function listed(lines: readonly string[]): readonly string[] {
  const held: string[] = [];

  for (const line of lines) {
    const item = /^\s+-\s*(?<held>.+)$/u.exec(line)?.groups?.["held"];
    const bare = line.trim();

    if (item !== undefined) held.push(unquoted(item));
    else if (bare !== "" && !bare.startsWith("#")) break;
  }

  return held;
}

/**
 * Reads the workspace out of a `pnpm-workspace.yaml` beside the manifest.
 *
 * @remarks
 *   The file is scanned line by line rather than parsed, because the one key
 *   that matters is at the top level and pulling in a YAML parser would put a
 *   dependency in front of every package that composes a config.
 * @throws {@link Error} When the file exists and cannot be read.
 */
function pnpm(at: string): readonly string[] | undefined {
  const path = join(at, "pnpm-workspace.yaml");

  if (!existsSync(path)) return undefined;

  const lines = readFileSync(path, "utf8").split("\n");

  for (const [index, line] of lines.entries()) {
    if (line.startsWith("packages:")) return flowing(line) ?? listed(lines.slice(index + 1));
  }

  return [];
}

/**
 * Each reader in the order it gets a turn.
 */
const READERS: readonly Reader[] = [declared, pnpm];

/**
 * Reports what a directory declares as its workspace, or nothing when it declares none.
 *
 * @remarks
 *   The manifest is asked before the pnpm file, so a repository carrying both
 *   is described by its manifest. An empty array separates a root that lists no
 *   package from a directory that is not a root at all.
 * @param at - The directory to look beside for a package manager's own file.
 * @param manifest - The parsed manifest found in that directory.
 */
export function workspaces(
  at: string,
  manifest: Readonly<Record<string, unknown>>,
): readonly string[] | undefined {
  for (const reader of READERS) {
    const held = reader(at, manifest);

    if (held !== undefined) return held;
  }

  return undefined;
}
