/**
 * Adds the stylesheet compiler to whatever plugins an application's tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";
import { type Options, theme } from "@stealthscale/vite-plugin-theme";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Adds `theme.stylesheet()` to the plugins of an application.
 *
 * @remarks
 *   The plugin is constructed when this call runs, so two calls produce two plugin instances.
 * @param stated - The parts of the plugin's options a repository departs on. Omitting it compiles
 *   under the defaults the plugin documents.
 */
export function stylesheet(stated: Options = {}): Contribution {
  return contribute({
    at: AT,
    because:
      "an application is the one package that knows both the components on its page and the " +
      "themes they are drawn in, so it is the one package that compiles the stylesheet",
    item: theme.stylesheet(stated),
    name: "theme.stylesheet",
  });
}
