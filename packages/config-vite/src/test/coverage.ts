/**
 * What coverage counts, what it does not, and how much of it is enough.
 */

import { type Preset, preset } from "@stealthscale/config-core";

import { FOREIGN } from "#ignore/foreign.ts";
import { GENERATED } from "#ignore/generated.ts";

/**
 * What is not source, and so is not something coverage can be low on.
 *
 * A specification is the measurement rather than the thing measured. A fixture exists to be read by
 * one. A config is run once by a tool and has no branches worth covering. A declaration holds no
 * statements at all.
 *
 * What was installed or built is here for a different reason: the provider's own list is empty, and
 * it counts whatever the tests loaded. A specification reaching a sibling package reaches its
 * `dist`, and a repository asking to see uncovered files reaches its own — neither is source
 * anybody wrote.
 */
const UNCOUNTED = [
  "**/*.spec.{ts,tsx}",
  "**/*.fixtures.{ts,tsx}",
  "**/*.config.ts",
  "**/*.d.ts",
  ...GENERATED,
  ...FOREIGN,
];

/**
 * How much of what is counted has to be reached.
 *
 * All of it. A threshold below a hundred is a number somebody picked, and the next person cannot
 * tell whether the gap between it and a hundred is deliberate or left over. At a hundred the
 * question is asked at the line that is not covered, where somebody can answer it — by writing the
 * test, or by saying in the config which files are not worth counting.
 *
 * Checked over the package rather than per file, so one small file with an awkward branch does not
 * have to be perfect while a large one hides behind an average. A repository that cannot hold to it
 * lowers it with `test.override.covering`, and the lowered number is then a decision with a name on
 * it.
 */
const ENOUGH = {
  branches: 100,
  functions: 100,
  lines: 100,
  perFile: false,
  statements: 100,
};

/**
 * Counts what a test reached, and leaves out what was never source.
 *
 * Off until asked for, as the runner has it, because counting costs time on every run and the
 * number is read at a review rather than at a save. What is stated here is what the number means
 * when somebody does ask.
 *
 * @returns The preset.
 */
export function coverage(): Preset {
  return preset({
    config: {
      test: {
        coverage: {
          enabled: true,
          exclude: UNCOUNTED,
          provider: "v8",
          reporter: ["text", "html", "lcov"],
          thresholds: ENOUGH,
        },
      },
    },
    name: "test.coverage",
  });
}
