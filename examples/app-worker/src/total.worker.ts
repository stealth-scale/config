/// <reference lib="webworker" />

/**
 * The worker itself: everything that must not run on the thread drawing the page.
 */

import { type Amount } from "@stealthscale/example-lib-core";

import { totalling } from "#totalling.ts";

self.addEventListener("message", (held: MessageEvent<readonly Amount[]>) => {
  self.postMessage(totalling(held.data));
});
