/**
 * Sorts the declarations a rail lists into the tree it draws.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { type Entry, entryOf } from "#catalogue/entry.ts";

/**
 * One page of a rail, against the route it opens.
 */
export interface Listed {
  /**
   * The entry the declaration carried.
   */
  readonly entry: Entry;

  /**
   * The identifier the link resolves through.
   */
  readonly id: string;
}

/**
 * One heading of a rail, and the pages under it.
 */
export interface Group {
  /**
   * The heading, or empty where the pages under it named none. The rail words an empty one, because
   * a heading nobody wrote is the rail's to name and not this module's.
   */
  readonly name: string;

  /**
   * The pages, sorted by the words the rail writes.
   */
  readonly pages: readonly Listed[];
}

/**
 * Compares two headings, putting an empty one last.
 *
 * @remarks
 *   Two headings are never equal, because each is a key of the map they were collected into.
 */
function before(one: string, next: string): number {
  if (one === "") return 1;
  if (next === "") return -1;

  return one.localeCompare(next);
}

/**
 * Returns the declarations a rail lists, grouped by heading and sorted by name within each.
 *
 * @remarks
 *   A declaration carrying no entry is left out, because a route in no rail is ordinary. Both
 *   levels sort by name rather than by the order the declarations arrived, so a page added by an
 *   application lands where a reader would look for it rather than at the end.
 * @param declarations - Every route compiled into the catalogue, whatever declared them.
 * @returns One group per heading, sorted by heading, each holding its pages sorted by label.
 */
export function grouped(declarations: readonly RouteDeclaration[]): readonly Group[] {
  const held = new Map<string, Listed[]>();

  for (const declaration of declarations) {
    const entry = entryOf(declaration);

    if (entry === undefined) continue;

    const name = entry.group ?? "";

    held.set(name, [...(held.get(name) ?? []), { entry, id: declaration.id }]);
  }

  return [...held]
    .map(([name, pages]) => ({
      name,
      pages: pages.toSorted((one, next) => one.entry.label.localeCompare(next.entry.label)),
    }))
    .toSorted((one, next) => before(one.name, next.name));
}
