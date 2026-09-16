/**
 * What coverage counts, what it does not, and how much of it is enough.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { FOREIGN } from "#ignore/foreign.ts";
import { GENERATED } from "#ignore/generated.ts";

/**
 * The source files coverage counts, whether or not a test loaded them.
 *
 * The provider's default counts only the files the tests imported. Under that default a source file
 * with no test is absent from the report, and a package with no specifications reports full
 * coverage of nothing. Naming the source here puts every file in the report at zero until a test
 * reaches it. The glob is written from any depth, because a workspace root measures every
 * package's source from its own directory.
 */
const COUNTED = ["**/src/**"];

/**
 * What is not source, and so is not something coverage can be low on.
 *
 * A specification is the measurement rather than the thing measured. A fixture exists to be read by
 * one. A config is run once by a tool and has no branches worth covering. A declaration holds no
 * statements at all.
 *
 * An entry point runs the program: `main.tsx` mounts the application, a file under `bin` is the
 * command, and a worker file is the worker. Each one has a side effect at module scope and no
 * branch of its own, and what it calls is covered where it is written.
 *
 * What was installed or built is here for a different reason: a specification reaching a sibling
 * package reaches its `dist`, and a repository asking to see uncovered files reaches its own —
 * neither is source anybody wrote.
 */
const UNCOUNTED = [
  "**/*.spec.{ts,tsx}",
  "**/*.fixtures.{ts,tsx}",
  "**/*.config.ts",
  "**/*.d.ts",
  "**/src/main.{ts,tsx}",
  "**/src/bin/**",
  "**/*.worker.{ts,tsx}",
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
 * On for every run, which is not the runner's own default. The threshold is the gate, and a gate
 * that closes only when somebody asks for it is no gate. The cost is a slower run, and what is
 * stated here is what the number means.
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
          include: COUNTED,
          provider: "v8",
          reporter: ["text-summary", "html", "lcov"],
          thresholds: ENOUGH,
        },
      },
    },
    name: "test.coverage",
  });
}
