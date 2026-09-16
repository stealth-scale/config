import { type Extendable, lint } from "@stealthscale/vite-config";

/**
 * What the root states on this package's behalf.
 *
 * The linter reads the root config only, so a relaxation for this package's files is composed
 * there. The globs are written from the root, and the reason is written here, beside the code it
 * excuses.
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
