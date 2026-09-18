/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The test setup imports the catalogues the plugin answers, and no plugin runs here: this package
 *   is what that module is read with, not an application the plugin finds catalogues for. So the
 *   module is answered with no catalogue in it, and the build leaves it external for the
 *   application's own plugin to answer.
 */

import { contribute, preset } from "@stealthscale/vite-config-core";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

/**
 * The module the catalogue plugin answers, as this package's own specifications see it.
 */
const ID = "virtual:i18n";

/**
 * The module's source with no catalogue in it: the fallback language alone, no words, no loader.
 */
const EMPTY = [
  "export const catalogues = {",
  "  bundled: {},",
  "  defaults: {},",
  '  fallback: "en",',
  "  languages: [],",
  "  load: () => Promise.resolve(undefined),",
  "  namespaces: [],",
  "};",
].join("\n");

/**
 * Answers the catalogues' module with nothing found.
 */
const unfound = contribute({
  at: "plugins",
  because:
    "the test setup imports the catalogues the plugin answers, and no plugin finds any for the " +
    "package that reads them",
  item: {
    /**
     * Answers the module with no catalogue in it.
     */
    load: (id: string): string | undefined => (id === `\0${ID}` ? EMPTY : undefined),

    name: "stealth:i18n.unfound",

    /**
     * Claims the module's identifier and leaves every other import alone.
     */
    resolveId: (id: string): string | undefined => (id === ID ? `\0${ID}` : undefined),
  },
  name: "i18n.unfound",
});

/**
 * Leaves what the plugin answers out of the build, as an import for the application to resolve.
 */
const virtual = preset({
  config: { pack: { deps: { neverBundle: [/^virtual:/u] } } },
  name: "pack.virtual",
});

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), unfound, virtual],
});
