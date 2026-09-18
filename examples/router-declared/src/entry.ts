/**
 * Reads the menu entry a declaration carries.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { type Condition } from "#catalogue.ts";

/**
 * The entry a declaration carries for a menu to draw it with.
 */
export interface Entry {
  /**
   * The text the entry reads.
   */
  readonly label: string;

  /**
   * Where it sits among the others.
   */
  readonly order: number;
}

/**
 * Reads the menu entry a declaration carries, or nothing where it is listed nowhere.
 *
 * @remarks
 *   The compiler writes `navigation` onto the route without reading it, so what it holds is this
 *   application's to decide and this application's to check. A declaration this application does
 *   not control could carry anything under that name.
 * @param declaration - The declaration to read.
 * @returns The entry, or nothing.
 */
export function entryOf(declaration: RouteDeclaration<Condition>): Entry | undefined {
  const entry: unknown = declaration.navigation;

  if (typeof entry !== "object" || entry === null) return undefined;
  if (!("label" in entry) || typeof entry.label !== "string") return undefined;
  if (!("order" in entry) || typeof entry.order !== "number") return undefined;

  return { label: entry.label, order: entry.order };
}
