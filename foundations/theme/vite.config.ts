/**
 * Builds the design-system package for a browser, with the React layers and the runtime generator
 * added.
 *
 * @remarks
 *   The generator runs as soon as the configuration resolves, so the runtime under `generated/`
 *   exists before the type checker, the packer or the test runner reads the imports that name it.
 */

import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.runtime()],
});
