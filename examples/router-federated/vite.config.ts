/**
 * Configures the routed example application that draws a module another deployment owns.
 *
 * @remarks
 *   The host names the remote and gives no address, so the one in `public/remotes.json` is read
 *   when this application starts and a redeployment of the other one needs no build here. What a
 *   remote is loaded into is no business of the remote's: app-host mounts the same module straight
 *   onto a page, and this application mounts it under a route.
 */

import { join } from "node:path";

import { federation, preview, server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * The hostnames the development and preview servers answer on.
 */
const NAMES = ["app2.stealthscale.dev"];

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    federation.host({
      name: "tanstack",
      remotes: ["remote"],
      shared: react.federation.shared(),
      stubs: { "remote/Dashboard": join(import.meta.dirname, "src/remote.fixtures.tsx") },
    }),

    server.address(4404, NAMES),
    preview.address(4405, NAMES),
  ],
});
