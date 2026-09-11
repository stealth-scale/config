import { join } from "node:path";

import { federation as react } from "@stealthscale/config-react";
import { defineConfig } from "@stealthscale/config-react/preset/app";
import { federation, preview, server } from "@stealthscale/config-vite";

export default defineConfig({
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
    server.reachable(),
    server.bound(),
    preview.port(4405),
    preview.reachable(),
    preview.bound(),
  ],
});
