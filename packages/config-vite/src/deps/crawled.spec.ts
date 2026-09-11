import { expect, test } from "vite-plus/test";

import { crawled } from "#deps/crawled.ts";

test("appends to the list rather than replacing the pages the crawl found", () => {
  for (const held of crawled({ because: "why", from: ["src/preview.ts"] })) {
    expect(held.at).toBe("optimizeDeps.entries");
  }
});

test("makes one contribution per file, so one can be taken back without the rest", () => {
  const held = crawled({ because: "why", from: ["a.ts", "b.ts"] });

  expect(held.map((each) => each.name)).toEqual(["deps.crawled(a.ts)", "deps.crawled(b.ts)"]);
});

test("carries the glob as it was written, the crawl reading it against the root", () => {
  const [held] = crawled({ because: "why", from: ["src/**/*.story.tsx"] });

  expect(held?.item).toBe("src/**/*.story.tsx");
});

test("keeps why the crawl misses it", () => {
  const [held] = crawled({ because: "the kit loads a preview, not a page", from: ["a.ts"] });

  expect(held?.because).toBe("the kit loads a preview, not a page");
});

test("contributes nothing when given nothing", () => {
  expect(crawled({ because: "why", from: [] })).toEqual([]);
});
