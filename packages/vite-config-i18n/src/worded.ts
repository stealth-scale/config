/**
 * Adds the foundation's setup file to the setup files a tier already built.
 */

import { createRequire } from "node:module";

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { setupIn } from "#setup.ts";

/**
 * The configuration key the setup file joins.
 */
const AT = "test.setupFiles";

/**
 * The foundation the setup file is published by.
 */
const FOUNDATION = "@stealthscale/provider-i18n";

/**
 * The absolute path of the setup file the runner loads.
 *
 * @remarks
 *   Resolved against this file, because the runner reads the path from the project root rather than
 *   from here.
 */
const SETUP = setupIn(createRequire(import.meta.url), FOUNDATION);

/**
 * Appends the foundation's setup file to the runner's setup files.
 *
 * @remarks
 *   The setup file assigns the global i18next instance from the catalogues the plugin found, in the
 *   fallback language. A specification that renders a component outside a provider therefore reads
 *   real words instead of the key.
 */
export function worded(): Contribution {
  return contribute({
    at: AT,
    because:
      "a specification renders a component without the application shell, and a component " +
      "looking a key up with no instance in scope renders the key",
    item: SETUP,
    name: "i18n.worded",
  });
}
