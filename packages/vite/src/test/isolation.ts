/**
 * What is put back between one test and the next.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * Undoes everything a test did to something it shares with the next one.
 *
 * A spy left in place, an environment variable left stubbed or a global left replaced is a test
 * writing into the one it runs before. The symptom is a suite that passes whole and fails when one
 * file is run alone, or the reverse, and neither failure names the test that caused it.
 *
 * All five are off by the runner's own default, which is why they are stated. Four of them undo
 * something a test did: a mock's recorded calls, its implementation, a stubbed variable, a replaced
 * global. The fifth reports what a test failed to undo — a timer or a handle still open when the
 * file finished, which is how a suite hangs at the end for no reason anybody can point at.
 *
 * @returns The preset.
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
