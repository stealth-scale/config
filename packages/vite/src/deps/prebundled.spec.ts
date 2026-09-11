import { expect, test } from "vite-plus/test";

import { prebundled } from "#deps/prebundled.ts";

test("appends to the list rather than replacing whatever the crawl found", () => {
  for (const held of prebundled({ because: "why", deps: ["lodash-es"] })) {
    expect(held.at).toBe("optimizeDeps.include");
  }
});

test("makes one contribution per specifier, so one can be taken back without the rest", () => {
  const held = prebundled({ because: "why", deps: ["one", "two"] });

  expect(held.map((each) => each.name)).toEqual(["deps.prebundled(one)", "deps.prebundled(two)"]);
});

test("carries the specifier as it is imported, deep import and all", () => {
  const [held] = prebundled({ because: "why", deps: ["@scope/pkg/deep/thing"] });

  expect(held?.item).toBe("@scope/pkg/deep/thing");
});

test("keeps why the crawler misses it, which is the part a reader cannot work out", () => {
  const [held] = prebundled({ because: "it is only imported dynamically", deps: ["one"] });

  expect(held?.because).toBe("it is only imported dynamically");
});

test("contributes nothing when given nothing", () => {
  expect(prebundled({ because: "why", deps: [] })).toEqual([]);
});
