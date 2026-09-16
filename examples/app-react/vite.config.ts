import { define, server } from "@stealthscale/vite-config";
import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), css.layers(), define.manifest(), server.port(4300)],
});
