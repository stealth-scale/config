/**
 * Builds this example as a plain React application on the default set of layers.
 *
 * @remarks
 *   Every layer here is one the preset already knows how to compose, and the file states nothing
 *   of its own beyond the port. It is the shape a new application starts from.
 */

import { define, server } from "@stealthscale/vite-config";
import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), css.layers(), define.manifest(), server.port(4300)],
});
