import { join } from "node:path";

import { federation as react } from "@stealthscale/config-react";
import { defineConfig } from "@stealthscale/config-react/preset/app";
import { federation, preview, server } from "@stealthscale/config-vite";

/**
 * The names this application is served under while it is being worked on, beyond loopback. Stated
 * rather than derived, so the tree says which application answers to which name. `STEALTH_HOSTS`
 * overrides it on a machine that has arranged something else.
 */
const NAMES = ["host.stealthscale.dev"];

export default defineConfig(import.meta.dirname, {
  extends: [
    // A name and no URL. `remote/Dashboard` is resolved while this is bundled, so the bundler has
    // to know the name; where that application is deployed is read from `public/remotes.json` when
    // this one starts, which is the only place a URL appears and the only file that differs
    // between the environments one artefact is promoted through.
    federation.host({
      name: "host",
      remotes: ["remote"],
      shared: react.shared(),
      stubs: { "remote/Dashboard": join(import.meta.dirname, "src/remote.fixtures.tsx") },
    }),

    server.port(4400),
    server.reachable(NAMES),
    server.bound(NAMES),
    preview.port(4401),
    preview.reachable(NAMES),
    preview.bound(NAMES),
  ],
});
