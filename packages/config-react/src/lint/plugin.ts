/**
 * The linter's React plugins, which it carries but does not turn on.
 */

import { contribute, type Contribution } from "@stealthscale/config-vite";

/**
 * Where a contribution to the list of plugins lands.
 */
const AT = "lint.plugins";

/**
 * The plugins whose rules only mean something where something renders.
 *
 * All three are built into the linter and all three are off until asked for, which is why enabling
 * them is this package's job rather than the toolchain's.
 */
const PLUGINS = ["react", "react-perf", "jsx-a11y"];

/**
 * Turns on the rules that know what a component is.
 *
 * Contributed one at a time so a repository that wants two of the three can take the other back by
 * name. Nothing is said here about which rules run: the toolchain already asks for every rule the
 * linter files under correctness, pedantic, perf and suspicious, and enabling a plugin is what
 * brings its share of those into the run.
 *
 * @returns One contribution for each plugin.
 */
export function plugins(): readonly Contribution[] {
  return PLUGINS.map((held) =>
    contribute({
      at: AT,
      because: "its rules only mean something where something renders",
      item: held,
      name: `react.plugin(${held})`,
    }),
  );
}
