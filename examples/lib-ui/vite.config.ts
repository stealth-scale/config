/**
 * Builds the library for a browser, with the React layers added.
 *
 * @remarks
 *   The web preset covers the CSS and the output format. The React layers add
 *   the JSX transform and keep React itself external, so the built library
 *   carries no copy of its own.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
