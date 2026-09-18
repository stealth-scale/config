/**
 * Builds the component package for a browser, with the React layers and the theme layers added.
 *
 * @remarks
 *   The theme layers contribute nothing. The preset under `src/theme.ts` is written by hand, and
 *   the package's own specification reports a recipe file it leaves out.
 */

import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), theme.layers()] });
