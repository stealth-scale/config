import { define, server } from "@stealthscale/config-vite";
import { defineConfig } from "@stealthscale/config-vite/preset/app";

export default defineConfig({
  extends: [
    define.manifest(import.meta.dirname),
    server.port(4200),
    server.proxy("/api", "http://localhost:8787"),
  ],
});
