/**
 * Answers a message carrying a run of amounts with the total of that run.
 *
 * @remarks
 *   One message in produces one message out, and the worker keeps no state between
 *   them, so two runs may be in flight at once. A run mixing currencies throws
 *   inside the handler, which posts nothing and surfaces as an error event on the
 *   worker rather than as a reply.
 */

/// <reference lib="webworker" />

import { type Amount } from "@stealthscale/example-lib-core";

import { totalling } from "#totalling.ts";

self.addEventListener("message", (held: MessageEvent<readonly Amount[]>) => {
  self.postMessage(totalling(held.data));
});
