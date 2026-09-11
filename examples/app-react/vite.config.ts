import { plugin as stylelint } from "@stealthscale/config-css";
import { defineConfig } from "@stealthscale/config-react/preset/app";
import { define, server } from "@stealthscale/config-vite";

export default defineConfig(import.meta.dirname, {
  extends: [stylelint.check(), define.manifest(), server.port(4300)],
});
