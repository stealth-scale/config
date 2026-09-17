/**
 * Builds this example as a themed React application: the React layers, the stylesheet compiler
 * and a port of its own.
 *
 * @remarks
 *   The compiler reads `theme.config.ts` for the themes, and the preset of every package on the
 *   dependency graph that publishes one for its recipes. The application itself states no style.
 */

import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet(), server.port(4700)],
});
