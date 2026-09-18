/**
 * Adds the specimen plugin to the plugins a tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";
import { type Options, specimens } from "@stealthscale/vite-plugin-specimen";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Appends `specimens()` to the plugins of an application that shows a catalogue.
 *
 * @remarks
 *   The plugin is constructed when this call runs, so two calls produce two plugin instances.
 * @param stated - Where the specimens are. `Options` documents every member.
 */
export function indexed(stated: Options): Contribution {
  return contribute({
    at: AT,
    because:
      "a catalogue lists every page before it loads one, which needs each specimen's metadata " +
      "parsed out of the source rather than read off a module that has run",
    item: specimens(stated),
    name: "specimen.indexed",
  });
}
