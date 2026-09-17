import { describe, expect, it, vi } from "vitest";

import { memoryStore } from "#stores/memory.ts";

describe("memoryStore", () => {
  it("reads back what was written", () => {
    const store = memoryStore();

    store.write("a", "one");

    expect(store.read("a")).toBe("one");
  });

  it("reads null for a key nothing wrote", () => {
    expect(memoryStore().read("a")).toBeNull();
  });

  it("reads the settings it was built with", () => {
    expect(memoryStore({ a: "one" }).read("a")).toBe("one");
  });

  it("reads null after the key is cleared", () => {
    const store = memoryStore({ a: "one" });

    store.clear("a");

    expect(store.read("a")).toBeNull();
  });

  it("tells a reader when the key is written", () => {
    const told = vi.fn<() => void>();
    const store = memoryStore();

    store.subscribe("a", told);
    store.write("a", "one");

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when the key is cleared", () => {
    const told = vi.fn<() => void>();
    const store = memoryStore({ a: "one" });

    store.subscribe("a", told);
    store.clear("a");

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("stops telling a reader that unsubscribed", () => {
    const told = vi.fn<() => void>();
    const store = memoryStore();
    const stop = store.subscribe("a", told);

    stop();
    store.write("a", "one");

    expect(told).not.toHaveBeenCalled();
  });

  it("keeps two stores apart", () => {
    const first = memoryStore();

    first.write("a", "one");

    expect(memoryStore().read("a")).toBeNull();
  });
});
