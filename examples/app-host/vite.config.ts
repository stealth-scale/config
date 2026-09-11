import { defineConfig } from "@stealthscale/config-react/preset/app";
import { preview, server } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [server.port(4400), preview.port(4401)],
});
