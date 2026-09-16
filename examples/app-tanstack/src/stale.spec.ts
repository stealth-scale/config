import { describe, expect, it } from "vitest";

import { stale, type Staleness, watching } from "#stale.ts";

function standing(already = false): {
  asked: number[];
  held: Staleness["held"];
  reload: () => void;
} {
  const store = new Map<string, string>(already ? [["stealth.stale", "1"]] : []);
  const asked: number[] = [];

  return {
    asked,
    held: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    },
    reload: () => {
      asked.push(1);
    },
  };
}

describe("stale", () => {
  it("fetches the page again when a chunk it was told about has gone", () => {
    const held = standing();

    stale(held)(new Event("vite:preloadError", { cancelable: true }));

    expect(held.asked).toHaveLength(1);
  });

  it("stops the bundler error propagating", () => {
    const held = standing();
    const event = new Event("vite:preloadError", { cancelable: true });

    stale(held)(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("fetches once", () => {
    const held = standing(true);

    stale(held)(new Event("vite:preloadError", { cancelable: true }));

    expect(held.asked).toStrictEqual([]);
  });

  it("lets the second failure throw", () => {
    const held = standing(true);
    const event = new Event("vite:preloadError", { cancelable: true });

    stale(held)(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("records the attempt", () => {
    const held = standing();

    stale(held)(new Event("vite:preloadError", { cancelable: true }));
    stale(held)(new Event("vite:preloadError", { cancelable: true }));

    expect(held.asked).toHaveLength(1);
  });

  it("listens for the bundler reporting a missing chunk", () => {
    const held = standing();

    watching(held);
    window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));

    expect(held.asked).toHaveLength(1);
  });
});
