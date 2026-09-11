import { define, server } from "@stealthscale/vite-config";
import { plugin as stylelint } from "@stealthscale/vite-config-css";
import { defineConfig } from "@stealthscale/vite-config-react/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [stylelint.check(), define.manifest(), server.port(4300)],
});
