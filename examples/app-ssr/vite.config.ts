import { preview, server, ssr } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),

    // The component library imports its own stylesheet, and `import "./panel.css"` is not something
    // node can load. While the package is linked the builder bundles it anyway, so this changes
    // nothing today; stated so that it keeps working once the same package is installed from a
    // registry rather than linked, which is when nothing else marks it out.
    ssr.bundle({
      because: "it imports its own stylesheet, which node has no way to load",
      deps: ["@stealthscale/example-lib-ui"],
    }),

    server.port(4600),
    preview.port(4601),
  ],
});
