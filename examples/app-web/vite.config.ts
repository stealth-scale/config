import { define, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [define.manifest(), server.port(4200), server.proxy("/api", "http://localhost:8787")],
});
