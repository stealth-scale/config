/**
 * Builds this example as a federation host that names its remotes but never locates them.
 *
 * @remarks
 *   `remote/Dashboard` is resolved while this application is bundled, so the build has to know the
 *   name. Where that application is deployed is read from `public/remotes.json` when this one
 *   starts, which keeps every URL out of the artefact and in the one file that differs between the
 *   environments a single build is promoted through.
 */

import { join } from "node:path";

import { federation, preview, server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * Lists the hostnames the host's development server answers to beyond loopback.
 *
 * @remarks
 *   Stated rather than derived, so the tree says which application answers to which name.
 *   `STEALTH_HOSTS` overrides it on a machine that has arranged something else.
 */
const NAMES = ["host.stealthscale.dev"];

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    federation.host({
      name: "host",
      remotes: ["remote"],
      shared: react.federation.shared(),
      stubs: { "remote/Dashboard": join(import.meta.dirname, "src/remote.fixtures.tsx") },
    }),

    server.address(4400, NAMES),
    preview.address(4401, NAMES),
  ],
});
