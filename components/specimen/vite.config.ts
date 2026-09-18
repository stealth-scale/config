/**
 * Builds the package for a browser, with the React layers added.
 *
 * @remarks
 *   No theme layers, because the package states no recipe of its own. Every part it draws is a
 *   component of the library, which carries the recipe a theme moves.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
