import { join } from "node:path";

import { federation, preview, server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * The names this application is served under while it is being worked on, beyond loopback. Stated
 * rather than derived, so the tree says which application answers to which name. `STEALTH_HOSTS`
 * overrides it on a machine that has arranged something else.
 */
const NAMES = ["host.stealthscale.dev"];

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    // A name and no URL. `remote/Dashboard` is resolved while this is bundled, so the bundler has
    // to know the name; where that application is deployed is read from `public/remotes.json` when
    // this one starts, which is the only place a URL appears and the only file that differs
    // between the environments one artefact is promoted through.
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
