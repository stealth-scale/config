/**
 * Adds a run of amounts up, wherever the run happens to be running.
 *
 * @remarks
 *   Nothing here touches the DOM or a worker API, so the same function serves the
 *   page, the worker and a test. The refusal to mix currencies belongs to the core
 *   library and travels out through this module unchanged.
 */

import { added, type Amount } from "@stealthscale/example-lib-core";

/**
 * Totals a run of amounts, taking the currency from the first one.
 *
 * @remarks
 *   An empty run names no currency, and a zero would have to claim one the caller
 *   never gave. Nothing comes back instead, which a caller distinguishes from a
 *   total of zero cents.
 * @returns The total of the run, or undefined when the run is empty.
 * @throws {@link Error} When two of the amounts are in different currencies.
 */
export function totalling(amounts: readonly Amount[]): Amount | undefined {
  const [first, ...rest] = amounts;

  if (first === undefined) return undefined;

  return rest.reduce((so, far) => added(so, far), first);
}
