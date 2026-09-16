/**
 * Builds this example as a federation remote that is not tied to the origin it was built for.
 *
 * @remarks
 *   The absence of `build.base` is the point. With no base, the federation plugin resolves this
 *   application's chunks against wherever `remoteEntry.js` was fetched from, so one build runs
 *   under any origin. Setting a base pins the build to one environment, which means a build per
 *   environment and a rebuild to move it.
 */

import { federation, preview, server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * Admits one hostname beside loopback to this remote's development server.
 *
 * @remarks
 *   Stated rather than derived, so the tree says which application answers to which name.
 *   `STEALTH_HOSTS` overrides it on a machine that has arranged something else.
 */
const NAMES = ["app1.stealthscale.dev"];

/**
 * Lists the origins allowed to fetch what this application serves.
 *
 * @remarks
 *   A host loads this application cross-origin, so its origin has to appear here or the browser
 *   refuses the entry module. `STEALTH_ORIGINS` overrides it.
 */
const ALLOWED = ["https://host.stealthscale.dev", "http://localhost:4401"];

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    federation.remote({
      exposes: { "./Dashboard": "./src/dashboard.tsx" },
      name: "remote",
      shared: react.federation.shared(),
    }),

    server.address(4402, NAMES),
    preview.address(4403, NAMES),
    preview.shared(ALLOWED),
  ],
});
