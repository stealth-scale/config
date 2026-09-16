/**
 * Adds the runtime generator to whatever plugins the system package's tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";
import { type Options, theme } from "@stealthscale/vite-plugin-theme";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Adds `theme.runtime()` to the plugins of the design-system package.
 *
 * @remarks
 *   The plugin is constructed when this call runs, so two calls produce two plugin instances.
 * @param stated - The parts of the plugin's options a repository departs on. Omitting it generates
 *   under the defaults the plugin documents.
 */
export function runtime(stated: Options = {}): Contribution {
  return contribute({
    at: AT,
    because:
      "the system package's own source imports the runtime the compiler generates from its " +
      "preset, so the runtime has to exist before a type checker, a packer or a test runner " +
      "resolves the import",
    item: theme.runtime(stated),
    name: "theme.runtime",
  });
}
