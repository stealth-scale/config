import { join } from "node:path";

import { federation as react } from "@stealthscale/config-react";
import { defineConfig } from "@stealthscale/config-react/preset/app";
import { federation, preview, server } from "@stealthscale/config-vite";

/**
 * The names this application is served under while it is being worked on, beyond loopback. Stated
 * rather than derived, so the tree says which application answers to which name. `STEALTH_HOSTS`
 * overrides it on a machine that has arranged something else.
 */
const NAMES = ["app2.stealthscale.dev"];

export default defineConfig(import.meta.dirname, {
  extends: [
    // The same remote app-host loads, from a second application with a router in front of it. What
    // a remote is loaded into is the remote's business not at all: it exposes modules, and whether
    // one arrives under a route or straight onto a page is the host's own decision.
    //
    // A name and no URL, the same as app-host. Where that application is deployed is read from
    // `public/remotes.json` when this one starts.
    federation.host({
      name: "tanstack",
      remotes: ["remote"],
      shared: react.shared(),
      stubs: { "remote/Dashboard": join(import.meta.dirname, "src/remote.fixtures.tsx") },
    }),

    server.port(4404),
    server.reachable(NAMES),
    server.bound(NAMES),
    preview.port(4405),
    preview.reachable(NAMES),
    preview.bound(NAMES),
  ],
});
