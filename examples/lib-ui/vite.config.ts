import { defineConfig } from "@stealthscale/config-react/preset/web";
import { pack } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [pack.published(import.meta.dirname)],
});
