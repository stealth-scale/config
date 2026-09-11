import { pack } from "@stealthscale/config-vite";
import { defineConfig } from "@stealthscale/config-vite/preset/node";

export default defineConfig(import.meta.dirname, {
  extends: [pack.published(import.meta.dirname)],
});
