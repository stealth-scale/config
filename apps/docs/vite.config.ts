/**
 * Builds the catalogue: the React layers, the stylesheet compiler, and the specimen index.
 *
 * @remarks
 *   The patterns reach across the workspace rather than into this directory, because a catalogue
 *   shows the components of the packages beside it and holds none of its own.
 */

import { server } from "@stealthscale/vite-config";
import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    i18n.layers(),
    theme.stylesheet(),
    specimen.catalogue({ patterns: ["../../components/*/src/**/*.specimen.tsx"], props: {} }),
    server.port(4100),
  ],
});
