/**
 * Reads which tab of an invoice is open out of the search string.
 */

/**
 * The tabs an invoice is read on.
 */
const TABS = ["history", "lines"] as const;

/**
 * Which tab of an invoice is open.
 */
export type Tab = (typeof TABS)[number];

/**
 * The values a route draws an invoice with.
 */
export interface Opened {
  /**
   * The tab the page shows, which is the lines where the search names none.
   */
  readonly tab: Tab;
}

/**
 * Reads the tab out of a search string, falling back to the lines.
 *
 * @remarks
 *   A plain function rather than a schema library, because one key with two values needs no
 *   dependency. `validateSearch` takes a Standard Schema too, which is what a form's fields are
 *   read through.
 * @param search - The search string, parsed into whatever it held.
 * @returns The tab the page draws.
 */
export function tabOf(search: Record<string, unknown>): Opened {
  const named = search["tab"];

  return { tab: TABS.find((tab) => tab === named) ?? "lines" };
}
