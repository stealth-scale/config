/**
 * Which files hold tests.
 */

import { type Preset, preset } from "#core/layer.ts";
import { FOREIGN } from "#ignore/foreign.ts";

/**
 * The one spelling a test file takes.
 *
 * The runner also reads `.test.`, and reading both means two conventions in one repository and no
 * way to tell which a file follows without opening it. One spelling, and the linter's relaxations
 * already name the same one.
 */
const TESTS = ["**/*.spec.{ts,tsx}"];

/**
 * Looks for tests where this house writes them, and nowhere else.
 *
 * @returns The preset.
 */
export function files(): Preset {
  return preset({
    config: { test: { exclude: [...FOREIGN], include: TESTS } },
    name: "test.files",
  });
}
