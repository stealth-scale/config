/**
 * Declares the single task a continuous integration job invokes.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The name the proving task is declared and invoked under.
 */
const CI = "ci";

/**
 * The commands that prove a repository, in the order they have to run.
 */
const PROVING = ["vp run -r build", "vp check", "vp test --run"];

/**
 * Declares a task that builds, then checks, then tests an entire repository.
 *
 * @remarks
 *   The order holds because a check reads what a build wrote and a test imports
 *   it. The task declares no cache, so a green run means these three commands
 *   ran rather than that an earlier run of them had. Installing dependencies is
 *   left to the job, and nothing here audits them.
 */
export function ci(): Preset {
  return preset({
    config: { run: { tasks: { [CI]: { cache: false, command: PROVING } } } },
    name: "run.ci",
  });
}
