/**
 * Builds this example as a plain React application on its own port.
 */

import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), server.port(4941)],
});
