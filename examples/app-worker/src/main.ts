/**
 * What the page runs once it has loaded.
 */

import { type Amount } from "@stealthscale/example-lib-core";

import { totalled } from "#total.worker-client.ts";

/**
 * What this page has to total.
 */
const OWED: readonly Amount[] = [
  { cents: 150, currency: "EUR" },
  { cents: 275, currency: "EUR" },
  { cents: -50, currency: "EUR" },
];

/**
 * Where the total is written.
 */
const output = document.querySelector("#total");

/**
 * The thread doing the arithmetic.
 *
 * Started from a URL rather than through the bundler's `?worker` suffix, which is the spelling the
 * platform defines and the one the type checker reads without help. `type: "module"` is what the
 * `es` worker format is for: without it this is a classic worker whatever the config says, and it
 * fails on its first import.
 *
 * Only for something a browser loads. `import.meta.url` means one thing in a page and another in
 * node, so this spelling does not survive a server render and an application that renders on a
 * server starts its workers some other way.
 */
const worker = new Worker(new URL("./total.worker.ts", import.meta.url), { type: "module" });

/**
 * What the worker made of them.
 */
const total = await totalled(worker, OWED);

if (output !== null && total !== undefined) {
  output.textContent = `${String(total.cents)}${total.currency}`;
}
