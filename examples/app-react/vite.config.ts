import { defineConfig } from "@stealthscale/config-react/preset/app";
import { plugin as stylelint } from "@stealthscale/config-stylelint";
import { define, server } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [stylelint.check(), define.manifest(import.meta.dirname), server.port(4300)],
});
