/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, because the provider writes the language
 *   and the direction onto one. The React layers give it a JSX transform.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
