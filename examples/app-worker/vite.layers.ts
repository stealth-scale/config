/**
 * Drops the one lint rule this example's workers cannot satisfy, for the root
 * configuration to pick up.
 *
 * @remarks
 *   A relaxation belongs to the package it covers, and the root imports this file
 *   rather than carrying a rule for somebody else's directory. The paths below are
 *   written from the repository root, because the root is where the rule is applied.
 */

import { type Extendable, lint } from "@stealthscale/vite-config";

/**
 * The layers the root configuration spreads in on this example's behalf.
 */
export const layers: readonly Extendable[] = [
  lint.relax({
    because:
      "the rule is written for `window.postMessage`, whose second argument is the origin " +
      "allowed to receive the message. A worker's takes a list of objects to transfer instead, " +
      "so there is no origin to pass and the rule asks for an argument that does not exist",
    files: ["examples/app-worker/src/*.worker.ts", "examples/app-worker/src/*.worker-client.ts"],
    rules: { "unicorn/require-post-message-target-origin": "off" },
  }),
];
