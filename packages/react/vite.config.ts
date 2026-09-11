import { pack } from "@stealthscale/config-vite";
import { defineConfig } from "@stealthscale/config-vite/preset/node";

export default defineConfig({
  extends: [pack.published(import.meta.dirname)],
});
