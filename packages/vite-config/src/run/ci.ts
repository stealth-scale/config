/**
 * The one command that proves a repository.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * What the task is called, so a workflow and a repository agree on one word.
 */
const CI = "ci";

/**
 * What proving a repository consists of, in the order the steps depend on each other.
 *
 * The build comes first because everything after it reads what it wrote: a package resolves another
 * by name through the map the packer writes, and a checkout that has built nothing has no map. Then
 * the checks, which are static and cheap and fail on the largest class of mistake. Then the tests,
 * which are the slowest and the most specific.
 */
const PROVING = ["vp run -r build", "vp check", "vp test --run"];

/**
 * Proves the whole repository with one command.
 *
 * A workflow that spells out the same steps is a second copy of them, and it drifts in the
 * direction nobody notices: the workflow keeps passing while it stops checking something. Naming
 * them here puts them where they can be run the same way on a laptop.
 *
 * Not cached, and the setting reaches the check and the test steps, which therefore run every
 * time. The builds are package scripts inlined from `vp run -r build`, and they keep the
 * workspace's script cache, so a second run replays them. A run that must rebuild as well passes
 * `--no-cache`.
 *
 * Installing dependencies and auditing them are deliberately absent. Both need the package manager
 * by name, which is the repository's choice rather than the house's, and a workflow has already
 * made that choice before it reaches this command.
 *
 * @returns The preset.
 */
export function ci(): Preset {
  return preset({
    config: { run: { tasks: { [CI]: { cache: false, command: PROVING } } } },
    name: "run.ci",
  });
}
