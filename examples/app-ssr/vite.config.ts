/**
 * Configures the example application that renders on a server and hydrates in a browser.
 *
 * @remarks
 *   The shared component library imports its own stylesheet, and node cannot load
 *   `import "./panel.css"`. Naming it for bundling changes nothing while the package is linked,
 *   because the builder bundles a linked package either way, and it keeps the server pass working
 *   once that package arrives from a registry instead.
 */

import { preview, server, ssr } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    ssr.bundle({
      because: "it imports its own stylesheet, which node has no way to load",
      deps: ["@stealthscale/example-lib-ui"],
    }),

    server.port(4600),
    preview.port(4601),
  ],
});
