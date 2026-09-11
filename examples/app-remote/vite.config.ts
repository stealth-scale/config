import { defineConfig } from "@stealthscale/config-react/preset/app";
import { build, preview, server } from "@stealthscale/config-vite";

/**
 * Where the host's own build is served from, and so the one origin allowed to fetch this one's.
 */
const HOST = "http://localhost:4401";

/**
 * Where this application's built files are served from.
 *
 * The preview port rather than the dev server's, because `base` is written into the build and the
 * build is what a preview serves.
 */
const SERVED = "http://localhost:4403";

export default defineConfig({
  extends: [
    // Absolute, because the chunks are fetched by a page this application did not serve. A relative
    // URL would resolve against the host's origin, where none of them are.
    build.served(`${SERVED}/`),
    server.port(4402),
    preview.port(4403),
    preview.shared([HOST]),
  ],
});
