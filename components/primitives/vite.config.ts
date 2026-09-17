/**
 * Builds the component package for a browser, with the React layers added.
 *
 * @remarks
 *   No theme layers, because nothing here draws an element and the package carries no recipe.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
