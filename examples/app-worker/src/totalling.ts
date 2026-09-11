/**
 * What the worker does, kept apart from the worker so it can be specified without one.
 */

import { added, type Amount } from "@stealthscale/example-lib-core";

/**
 * Totals a run of amounts.
 *
 * The same module the page imports, which is the point of bundling the worker as a module: the two
 * share one chunk rather than each carrying a copy.
 *
 * @param amounts - The amounts to total. All of one currency.
 * @returns The total, or nothing where there was nothing to total.
 */
export function totalling(amounts: readonly Amount[]): Amount | undefined {
  const [first, ...rest] = amounts;

  if (first === undefined) return undefined;

  return rest.reduce((so, far) => added(so, far), first);
}
