import { expect, test } from "vite-plus/test";

import { stale, type Staleness, watching } from "#stale.ts";

/**
 * Stands in for the page and for where the attempt is recorded.
 *
 * @param already - Whether this page has reloaded once already.
 * @returns The stand-in, and a count of the reloads asked for.
 */
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

test("fetches the page again when a chunk it was told about has gone", () => {
  const held = standing();

  stale(held)(new Event("vite:preloadError", { cancelable: true }));

  expect(held.asked).toHaveLength(1);
});

test("stops the bundler throwing, having decided what to do about it", () => {
  const held = standing();
  const event = new Event("vite:preloadError", { cancelable: true });

  stale(held)(event);

  expect(event.defaultPrevented).toBe(true);
});

test("does it once, so a deployment missing its files is not reloaded at forever", () => {
  const held = standing(true);

  stale(held)(new Event("vite:preloadError", { cancelable: true }));

  expect(held.asked).toEqual([]);
});

test("lets the second failure throw, which is what puts it in front of somebody", () => {
  const held = standing(true);
  const event = new Event("vite:preloadError", { cancelable: true });

  stale(held)(event);

  expect(event.defaultPrevented).toBe(false);
});

test("records the attempt, so a reload that does not help is not repeated", () => {
  const held = standing();

  stale(held)(new Event("vite:preloadError", { cancelable: true }));
  stale(held)(new Event("vite:preloadError", { cancelable: true }));

  expect(held.asked).toHaveLength(1);
});

test("listens for the bundler saying a chunk has gone", () => {
  const held = standing();

  watching(held);
  window.dispatchEvent(new Event("vite:preloadError", { cancelable: true }));

  expect(held.asked).toHaveLength(1);
});
