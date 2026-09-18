/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, because the providers below write onto one.
 *   The React layers give them a JSX transform.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
