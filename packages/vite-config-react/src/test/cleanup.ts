/**
 * Points the test runner at the setup file every React test runs first.
 */

import { createRequire } from "node:module";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The configuration key a setup file joins.
 */
const AT = "test.setupFiles";

/**
 * The absolute path of the shipped setup file, resolved through this package's own exports.
 */
const SETUP = createRequire(import.meta.url).resolve(
  "@stealthscale/vite-config-react/vitest.setup.ts",
);

/**
 * Adds the React setup file to whatever setup a tier already runs.
 *
 * @remarks
 *   A consumer resolves the file by package name rather than by path, so the same layer works from
 *   a workspace link and from an installed copy.
 */
export function cleanup(): Contribution {
  return contribute({
    at: AT,
    because:
      "React accepts act only after a global says so, and a mounted component outlives the test " +
      "that mounted it",
    item: SETUP,
    name: "react.test.cleanup",
  });
}
