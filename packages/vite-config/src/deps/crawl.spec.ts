import { describe, expect, it } from "vitest";

import { crawl } from "#deps/crawl.ts";

describe("crawl", () => {
  it("appends to the list rather than replacing the pages the crawl found", () => {
    for (const held of crawl({ because: "why", files: ["src/preview.ts"] })) {
      expect(held.at).toBe("optimizeDeps.entries");
    }
  });

  it("makes one contribution per file", () => {
    const held = crawl({ because: "why", files: ["a.ts", "b.ts"] });

    expect(held.map((each) => each.name)).toStrictEqual(["deps.crawl(a.ts)", "deps.crawl(b.ts)"]);
  });

  it("keeps the glob as it was written", () => {
    const [held] = crawl({ because: "why", files: ["src/**/*.story.tsx"] });

    expect(held?.item).toBe("src/**/*.story.tsx");
  });

  it("keeps the reason the crawl misses it", () => {
    const [held] = crawl({ because: "the kit loads a preview, not a page", files: ["a.ts"] });

    expect(held?.because).toBe("the kit loads a preview, not a page");
  });

  it("contributes nothing when given nothing", () => {
    expect(crawl({ because: "why", files: [] })).toStrictEqual([]);
  });
});
