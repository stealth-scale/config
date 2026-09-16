/**
 * Configures the example that totals its amounts on a worker thread.
 *
 * @remarks
 *   Vite decides what to pre-bundle by following the imports reachable from the
 *   page. A worker is started from a URL, which that walk does not follow, so
 *   whatever the worker itself depends on would first be seen when the worker
 *   runs, costing a second optimise pass and a reload. Naming the worker files
 *   moves that discovery into startup.
 */

import { deps, preview, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    deps.crawl({
      because: "a worker is started from a URL, which no crawl follows as an import",
      files: ["src/*.worker.ts"],
    }),

    server.port(4500),
    preview.port(4501),
  ],
});
