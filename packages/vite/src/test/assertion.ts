/**
 * What a test has to do to count as one.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Refuses a test that asserts nothing, and shows a whole snapshot when one breaks.
 *
 * A test with no assertion passes. It passes when the code is right, and it passes when the code is
 * wrong, which makes it worse than no test: the suite reports a number that includes it. The usual
 * cause is an assertion left inside a callback nothing awaited.
 *
 * The runner's API is imported rather than ambient, stated here because a global `expect` is the
 * other way a file can look tested without saying what it imported.
 *
 * A failed snapshot shows the whole diff rather than a patch around the change, because reading a
 * patch means guessing at what surrounds it.
 *
 * @returns The preset.
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
