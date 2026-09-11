/**
 * Which directories a workspace holds, whichever package manager was used to state them.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * How one package manager states the directories a workspace holds.
 *
 * Answers nothing where this is not that package manager's workspace, which is what lets the next
 * reader be tried. An empty list is a different answer: the workspace is stated and holds nothing.
 *
 * @param at - The directory that might be a workspace root.
 * @param manifest - The manifest already read from it, so no reader opens that file twice.
 * @returns Each directory, or nothing where this reader does not recognise the workspace.
 */
type Reader = (
  at: string,
  manifest: Readonly<Record<string, unknown>>,
) => readonly string[] | undefined;

/**
 * Keeps the names out of a list that holds anything else.
 *
 * @param held - The list as the file holds it.
 * @returns Every entry that is a name.
 */
function names(held: readonly unknown[]): readonly string[] {
  return held.filter((one): one is string => typeof one === "string");
}

/**
 * Reads the `workspaces` field, which is where npm, bun and yarn each state a workspace.
 *
 * Two spellings: a list, and an object holding one under `packages`. Both are read, because a
 * manifest written for one of the three is routinely installed by another.
 *
 * @param at - Unused. A manifest states this without a second file.
 * @param manifest - The manifest read from that directory.
 * @returns Each directory, or nothing where the manifest states no workspace.
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
 * Strips the quotes and the trailing comment a YAML scalar may carry.
 *
 * @param held - The scalar as the line holds it.
 * @returns The directory it names.
 */
function unquoted(held: string): string {
  const bare = held
    .trim()
    .replace(/\s+#.*$/u, "")
    .trim();

  return /^(?<quote>["'])(?<held>.*)\k<quote>$/u.exec(bare)?.groups?.["held"] ?? bare;
}

/**
 * Reads the directories written on the `packages:` line itself.
 *
 * @param line - That line.
 * @returns Each directory, or nothing where the line opens a block instead.
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
 * Reads the directories written under the `packages:` line, one to a line.
 *
 * Stops at the first line that is neither an entry, a comment nor blank, which is the next thing
 * the file states rather than another directory.
 *
 * @param lines - Everything below that line.
 * @returns Each directory.
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
 * Reads the `packages` list out of `pnpm-workspace.yaml`, which is the only place pnpm states one.
 *
 * Scanned rather than parsed. This is the package every other one depends on, and a YAML parser to
 * read a list of strings is a dependency every consumer would then carry. Both spellings pnpm
 * writes are read: a block sequence under `packages:`, and a flow sequence on the same line.
 *
 * @param at - The directory to look in.
 * @returns Each directory, or nothing where the directory holds no such file.
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
 * Every way a workspace is stated, in the order they are tried.
 *
 * The manifest first. A repository that states a workspace there and also keeps a pnpm file is
 * answered from the manifest, which is the file every one of the three reads.
 *
 * A package manager is added by writing its reader and putting it here.
 */
const READERS: readonly Reader[] = [declared, pnpm];

/**
 * Reads the directories a workspace holds.
 *
 * @param at - The directory that might be a workspace root.
 * @param manifest - The manifest already read from it.
 * @returns Each directory, or nothing where no package manager recognises a workspace here, which
 *   is what tells a package apart from a root.
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
