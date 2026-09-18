/**
 * Adds the catalogue plugin to the plugins a tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";
import { i18n, type Options } from "@stealthscale/vite-plugin-i18n";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Appends `i18n()` to the plugins of a package or an application with catalogues.
 *
 * @remarks
 *   The plugin is constructed when this call runs, so two calls produce two plugin instances.
 * @param stated - The plugin options a repository departs on. Omitting it searches under the
 *   defaults the plugin documents.
 */
export function catalogued(stated: Options = {}): Contribution {
  return contribute({
    at: AT,
    because:
      "a component looks a word up by key, and no key exists until every package's catalogue " +
      "has been found, merged and typed",
    item: i18n(stated),
    name: "i18n.catalogued",
  });
}
