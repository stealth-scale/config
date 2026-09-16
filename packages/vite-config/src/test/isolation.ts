/**
 * Puts back what a test changed before the next one runs.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Restores a mock, an environment variable and a global after every test.
 *
 * @remarks
 *   Without this a test can pass on what the test before it left behind, and
 *   fail once the order changes. The order does change, because the suite is
 *   shuffled.
 */
export function isolation(): Preset {
  return preset({
    config: {
      test: {
        clearMocks: true,
        restoreMocks: true,
        unstubEnvs: true,
        unstubGlobals: true,
      },
    },
    name: "test.isolation",
  });
}
