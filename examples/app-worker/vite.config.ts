import { deps, layout, preview, server, worker } from "@stealthscale/config-vite";
import { defineConfig } from "@stealthscale/config-vite/preset/app";

export default defineConfig({
  extends: [
    layout.page("page"),

    // The page and the worker both reach `@stealthscale/example-lib-core`. As a module the worker
    // can import, so the bundler may split what they share; left alone it emits a classic worker
    // wrapped in a function call, which cannot import and must inline whatever it reaches. At this
    // size the bundler inlines either way — what the format buys is that it has the choice.
    worker.format(),

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
