/**
 * Configures the example application that ships without a framework.
 *
 * @remarks
 *   The proxy keeps the browser on a single origin, so a request to /api carries
 *   no preflight and the service behind it needs no CORS headers. Nothing in this
 *   repository listens on the port it forwards to, and a request through it fails
 *   at the connection rather than in the browser.
 */

import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200), server.proxy("/api", "http://localhost:8787")],
});
