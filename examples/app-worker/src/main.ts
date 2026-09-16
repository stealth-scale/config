/**
 * Totals a fixed run of amounts off the main thread and prints the result.
 *
 * @remarks
 *   The worker is awaited at the top level, so the page's module does not finish
 *   evaluating until the total arrives. That suits an example of three amounts
 *   and would be the wrong shape for a page with anything else to paint.
 */

import { type Amount } from "@stealthscale/example-lib-core";

import { totalled } from "#total.worker-client.ts";

/**
 * The amounts the page totals, the last of them a credit.
 */
const OWED: readonly Amount[] = [
  { cents: 150, currency: "EUR" },
  { cents: 275, currency: "EUR" },
  { cents: -50, currency: "EUR" },
];

/**
 * The element index.html offers for the total.
 */
const output = document.querySelector("#total");

/**
 * The thread the totalling runs on.
 *
 * @remarks
 *   The URL is built from import.meta.url because that is the form the bundler
 *   recognises, and recognising it is what gets the worker built as its own chunk
 *   and rewritten to its hashed name. A plain string would be shipped untouched
 *   and fetched from a path that no longer exists.
 */
const worker = new Worker(new URL("./total.worker.ts", import.meta.url), { type: "module" });

/**
 * The total the worker replied with, which is present because OWED is not empty.
 */
const total = await totalled(worker, OWED);

if (output !== null && total !== undefined) {
  output.textContent = `${String(total.cents)}${total.currency}`;
}
