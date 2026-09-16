import { describe, expect, it } from "vitest";

import { prebundle } from "#deps/prebundle.ts";

describe("prebundle", () => {
  it("appends to the list rather than replacing whatever the crawl found", () => {
    for (const held of prebundle({ because: "why", deps: ["lodash-es"] })) {
      expect(held.at).toBe("optimizeDeps.include");
    }
  });

  it("makes one contribution per specifier", () => {
    const held = prebundle({ because: "why", deps: ["one", "two"] });

    expect(held.map((each) => each.name)).toStrictEqual([
      "deps.prebundle(one)",
      "deps.prebundle(two)",
    ]);
  });

  it("keeps the specifier as it is imported including a deep import", () => {
    const [held] = prebundle({ because: "why", deps: ["@scope/pkg/deep/thing"] });

    expect(held?.item).toBe("@scope/pkg/deep/thing");
  });

  it("keeps the reason the crawler misses it", () => {
    const [held] = prebundle({ because: "it is only imported dynamically", deps: ["one"] });

    expect(held?.because).toBe("it is only imported dynamically");
  });

  it("contributes nothing when given nothing", () => {
    expect(prebundle({ because: "why", deps: [] })).toStrictEqual([]);
  });
});
