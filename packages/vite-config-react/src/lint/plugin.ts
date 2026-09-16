/**
 * The linter's React plugins, which it carries but does not turn on.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * Where a contribution to the list of plugins lands.
 */
const AT = "lint.plugins";

/**
 * The plugins whose rules only mean something where something renders.
 *
 * Both are built into the linter and both are off until asked for, which is why enabling them is
 * this package's job rather than the toolchain's.
 *
 * `react-perf` is not among them. Every rule it carries asks for a value to be memoised by hand —
 * an array, an object, a function or an element passed as a prop — and this package turns the React
 * Compiler on, which memoises all four. A repository that turns the compiler off wants those rules
 * back and contributes the plugin to `lint.plugins` itself.
 */
const PLUGINS = ["react", "jsx-a11y"];

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
      name: `react.lint.plugins(${held})`,
    }),
  );
}
