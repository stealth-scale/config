/**
 * Decides which of the plugin's modules a changed file invalidates.
 */

import { createFilter } from "vite";

import { type Listed, listings, type Resolved } from "#emit.ts";

/**
 * Describes the three fields the plugin reads from a hot update.
 *
 * @remarks
 *   Narrower than Vite's own type, so a specification supplies three fields instead of a whole
 *   update.
 */
export interface Changed {
  /**
   * The absolute path of the file that changed.
   */
  readonly file: string;

  /**
   * Reads the file's current text.
   */
  readonly read: () => Promise<string> | string;

  /**
   * Whether the file was created, deleted, or edited.
   */
  readonly type: "create" | "delete" | "update";
}

/**
 * Describes the state the update hook reads from the last index that was generated.
 */
export interface Indexing {
  /**
   * Each file's listing and identifier, as the index was last generated.
   */
  readonly last: ReadonlyMap<string, Listed>;

  /**
   * The root and command the bundler resolved.
   */
  readonly resolved: Resolved;
}

/**
 * Returns true when a change invalidates the index.
 *
 * @remarks
 *   A page appearing or disappearing invalidates it. An edit invalidates it only when the file
 *   changed the metadata it declares, which is re-read and compared with the current listing.
 *   Editing a scene therefore reloads its page without regenerating the index.
 */
export async function reindexes(
  indexing: Indexing,
  patterns: readonly string[],
  changed: Changed,
): Promise<boolean> {
  const { file, read, type } = changed;

  if (!createFilter(patterns, undefined, { resolve: indexing.resolved.root })(file)) return false;
  if (type !== "update") return true;

  const current = listings(indexing.resolved, [{ path: file, text: await read() }]);

  return current.get(file)?.listing !== indexing.last.get(file)?.listing;
}

/**
 * Matches a file the compiler reads, whatever the change to it was.
 */
const TYPED = /\.[cm]?[jt]sx?$/u;

/**
 * Returns true when a change makes what the compiler last read stale.
 *
 * @remarks
 *   Any typed file under a searched directory, rather than the ones a page reaches. The compiler
 *   answers a page afresh in tens of milliseconds, and working out which pages a type change
 *   reaches would cost more than that.
 * @param roots - The absolute directories the patterns start searching in.
 */
export function retyped(roots: readonly string[], file: string): boolean {
  return TYPED.test(file) && roots.some((root) => file.startsWith(`${root}/`));
}

/**
 * Returns the identifier of the page a file declares.
 *
 * @returns The identifier, or undefined when the index lists no page for the file.
 */
export function pageOf(indexing: Indexing, file: string): string | undefined {
  return indexing.last.get(file)?.id;
}

/**
 * Resolves a page identifier to the file it was read from.
 *
 * @throws {@link Error} When no listed page carries the identifier.
 */
export function pathOf(indexing: Indexing, page: string): string {
  const entry = [...indexing.last].find(([, listed]) => listed.id === page);

  if (entry === undefined) throw new Error(`specimen: no page is called ${page}`);

  return entry[0];
}
