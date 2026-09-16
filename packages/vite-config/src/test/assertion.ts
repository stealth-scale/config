/**
 * Demands an assertion from every test file and widens the failure the runner
 * prints.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Fails a test that ran without asserting anything.
 *
 * @remarks
 *   A test whose assertions all sit inside a branch nothing took still passes
 *   in most runners, and reports green for code it never reached. The runner
 *   API stays imported rather than ambient, so the editor can follow it.
 */
export function assertion(): Preset {
  return preset({
    config: {
      test: {
        expandSnapshotDiff: true,
        expect: { requireAssertions: true },
        globals: false,
      },
    },
    name: "test.assertion",
  });
}
