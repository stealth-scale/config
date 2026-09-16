/**
 * Turns on the linter plugins whose rules understand a component.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The configuration key a linter plugin joins.
 */
const AT = "lint.plugins";

/**
 * The plugins loaded at a root that renders, named as the linter resolves them.
 */
const PLUGINS = ["react", "jsx-a11y"];

/**
 * Loads the React and accessibility plugins, one layer for each.
 *
 * @remarks
 *   Loading a plugin enables no rule on its own. Every rule this repository asks for is declared
 *   separately, so a consumer removing one layer loses that rule and keeps the others.
 * @returns One layer per plugin, each named for the plugin it loads, so a consumer can drop the
 *   accessibility rules without losing the React ones.
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
