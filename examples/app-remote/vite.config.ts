import { federation as react } from "@stealthscale/config-react";
import { defineConfig } from "@stealthscale/config-react/preset/app";
import { federation, preview, server } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [
    // No `build.served` here, and that absence is the point. With no base the federation plugin
    // resolves this application's chunks against wherever `remoteEntry.js` was fetched from, so one
    // build runs under any origin. Setting a base pins the build to the origin it was built for,
    // which is one build per environment and a rebuild to move it.
    federation.remote({
      exposes: { "./Dashboard": "./src/dashboard.tsx" },
      name: "remote",
      shared: react.shared(),
    }),

    server.port(4402),
    server.reachable(),
    server.bound(),
    preview.port(4403),
    preview.reachable(),
    preview.bound(),
    preview.shared(),
  ],
});
