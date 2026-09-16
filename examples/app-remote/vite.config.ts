import { federation, preview, server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * The names this application is served under while it is being worked on, beyond loopback. Stated
 * rather than derived, so the tree says which application answers to which name. `STEALTH_HOSTS`
 * overrides it on a machine that has arranged something else.
 */
const NAMES = ["app1.stealthscale.dev"];

/**
 * The origins allowed to fetch what this application serves. `STEALTH_ORIGINS` overrides it.
 */
const ALLOWED = ["https://host.stealthscale.dev", "http://localhost:4401"];

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    // No `build.base` here, and that absence is the point. With no base the federation plugin
    // resolves this application's chunks against wherever `remoteEntry.js` was fetched from, so one
    // build runs under any origin. Setting a base pins the build to the origin it was built for,
    // which is one build per environment and a rebuild to move it.
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
