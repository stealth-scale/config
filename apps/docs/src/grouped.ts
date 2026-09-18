/**
 * Sorts the index into the groups a rail lists.
 */

import { type Indexed } from "#types.ts";

/**
 * One heading of a rail, and the pages under it.
 */
export interface Group {
  /**
   * The group the pages declare, or empty where they declare none. The rail words an empty one,
   * because a heading nobody wrote is the rail's to name and not this module's.
   */
  name: string;

  /**
   * The pages, in the order the index gave them.
   */
  pages: readonly Indexed[];
}

/**
 * Returns the pages by group, the groups sorted by name and each page kept in index order.
 *
 * @remarks
 *   The index is already sorted by path, so the pages under a heading come out in the order the
 *   packages sit in the tree. Pages that declare no group are collected under an empty name and
 *   listed last.
 */
export function grouped(pages: readonly Indexed[]): readonly Group[] {
  const held = new Map<string, Indexed[]>();

  for (const page of pages) held.set(page.group, [...(held.get(page.group) ?? []), page]);

  return [...held]
    .map(([name, under]) => ({ name, pages: under }))
    .toSorted((one, next) => {
      if (one.name === "") return 1;
      if (next.name === "") return -1;

      return one.name.localeCompare(next.name);
    });
}
