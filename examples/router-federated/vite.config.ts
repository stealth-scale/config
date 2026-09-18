/**
 * Configures the example application that routes to pages another deployment declares.
 *
 * @remarks
 *   The host names the remote and gives no address, so the one in `public/remotes.json` is read
 *   when this application starts and a redeployment of the other one needs no build here. The
 *   addresses of the other deployment's pages arrive with its declarations, so this application
 *   hardcodes none of them either.
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
      name: "router",
      remotes: ["remote"],
      shared: react.federation.shared(),
      stubs: { "remote/routes": join(import.meta.dirname, "src/remote.fixtures.ts") },
    }),

    server.address(4404, NAMES),
    preview.address(4405, NAMES),
  ],
});
