/**
 * What order tests run in.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Runs the files and the tests in a different order every time.
 *
 * A test that only passes after another one has run is a test that does not say what it needs. Left
 * in a fixed order, it keeps passing until somebody adds a file above it or runs one on its own,
 * and the failure then names the wrong test.
 *
 * The runner prints the seed it used, so a shuffled failure is reproducible: the order is random
 * between runs rather than unknowable.
 *
 * @returns The preset.
 */
export function order(): Preset {
  return preset({ config: { test: { sequence: { shuffle: true } } }, name: "test.order" });
}
