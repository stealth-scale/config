import { deps, preview, server } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [
    // The dev server works out what to pre-bundle by crawling from the page. It reaches what the
    // page imports; the worker is reached through a URL rather than an import, so what the worker
    // itself depends on is found only when the worker first runs. Naming it starts the crawl there
    // too.
    deps.crawled({
      because: "a worker is started from a URL, which no crawl follows as an import",
      from: ["src/*.worker.ts"],
    }),

    server.port(4500),
    preview.port(4501),
  ],
});
