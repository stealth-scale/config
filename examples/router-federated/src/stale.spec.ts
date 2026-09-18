import { describe, expect, it } from "vitest";

import { stale, type Staleness, watching } from "#stale.ts";

function standing(already = false): {
  asked: number[];
  reload: () => void;
  store: Staleness["store"];
} {
  const kept = new Map<string, string>(already ? [["stealth.stale", "1"]] : []);
  const asked: number[] = [];

  return {
    asked,
    reload: () => {
      asked.push(1);
    },
    store: {
      getItem: (key: string) => kept.get(key) ?? null,
      setItem: (key: string, value: string) => {
        kept.set(key, value);
      },
    },
  };
}

describe("stale", () => {
  it("fetches the page again when a chunk it was told about has gone", () => {
    const staleness = standing();

    stale(staleness)(new Event("vite:preloadError", { cancelable: true }));

    expect(staleness.asked).toHaveLength(1);
  });

  it("stops the bundler error propagating", () => {
    const staleness = standing();
    const event = new Event("vite:preloadError", { cancelable: true });

    stale(staleness)(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("fetches once", () => {
    const staleness = standing(true);

    stale(staleness)(new Event("vite:preloadError", { cancelable: true }));

    expect(staleness.asked).toStrictEqual([]);
  });

  it("lets the second failure throw", () => {
    const staleness = standing(true);
    const event = new Event("vite:preloadError", { cancelable: true });

    stale(staleness)(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("records the attempt", () => {
    const staleness = standing();

    stale(staleness)(new Event("vite:preloadError", { cancelable: true }));
    stale(staleness)(new Event("vite:preloadError", { cancelable: true }));

    expect(staleness.asked).toHaveLength(1);
  });

  it("listens for the bundler reporting a missing chunk", () => {
    const staleness = standing();

    watching(staleness);
    window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));

    expect(staleness.asked).toHaveLength(1);
  });
});
