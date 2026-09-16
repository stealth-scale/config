/**
 * The order the runner takes the test files in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Shuffles the test files so one run does not repeat the order of the last.
 *
 * @remarks
 *   A test leaning on the one before it passes under a fixed order and fails
 *   under this one. It fails on some runs and not others, which is the point:
 *   the dependency is there whether or not a run happens to reveal it.
 */
export function order(): Preset {
  return preset({ config: { test: { sequence: { shuffle: true } } }, name: "test.order" });
}
