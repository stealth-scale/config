import { defineConfig } from "@stealthscale/config-react/preset/web";
import { plugin as stylelint } from "@stealthscale/config-stylelint";
import { define, server } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [stylelint.check(), define.manifest(import.meta.dirname), server.port(4300)],

  // Written out because there is no `test` block yet. It is what the block will have to state, and
  // it is the reason to build one.
  test: { environment: "happy-dom" },
});
