import { describe, expect, it, vi } from "vitest";

import { localStore } from "#stores/local.ts";

function replacing(value: PropertyDescriptor): () => void {
  const own = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

  Object.defineProperty(globalThis, "localStorage", { configurable: true, ...value });

  return () => {
    if (own === undefined) Reflect.deleteProperty(globalThis, "localStorage");
    else Object.defineProperty(globalThis, "localStorage", own);
  };
}

function holding(): () => void {
  const held = new Map<string, string>();

  return replacing({
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the store reads three of the interface's members and the browser's own storage is absent here
    value: {
      getItem: (key: string) => held.get(key) ?? null,
      removeItem: (key: string) => {
        held.delete(key);
      },
      setItem: (key: string, value: string) => {
        held.set(key, value);
      },
    },
  });
}

function refusing(): () => void {
  return replacing({
    get: () => {
      throw new Error("the browser refuses storage");
    },
  });
}

describe("localStore", () => {
  it("returns one store however many times it is called", () => {
    expect(localStore()).toBe(localStore());
  });

  it("reads back what was written", () => {
    const restore = holding();

    localStore().write("probe.read", "one");

    const read = localStore().read("probe.read");

    restore();

    expect(read).toBe("one");
  });

  it("reads null for a key nothing wrote", () => {
    const restore = holding();
    const read = localStore().read("probe.absent");

    restore();

    expect(read).toBeNull();
  });

  it("reads null after the key is cleared", () => {
    const restore = holding();

    localStore().write("probe.clear", "one");
    localStore().clear("probe.clear");

    const read = localStore().read("probe.clear");

    restore();

    expect(read).toBeNull();
  });

  it("reads null where the browser refuses storage", () => {
    const restore = refusing();
    const read = localStore().read("probe.refused-read");

    restore();

    expect(read).toBeNull();
  });

  it("writes nowhere where the browser refuses storage", () => {
    const restore = refusing();

    expect(() => {
      localStore().write("probe.refused-write", "one");
    }).not.toThrow();

    restore();
  });

  it("clears nothing where the browser refuses storage", () => {
    const restore = refusing();

    expect(() => {
      localStore().clear("probe.refused-clear");
    }).not.toThrow();

    restore();
  });

  it("tells a reader when this document writes the key", () => {
    const told = vi.fn<() => void>();
    const restore = holding();
    const stop = localStore().subscribe("probe.same", told);

    localStore().write("probe.same", "one");
    stop();
    restore();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when this document clears the key", () => {
    const told = vi.fn<() => void>();
    const restore = holding();
    const stop = localStore().subscribe("probe.cleared-here", told);

    localStore().clear("probe.cleared-here");
    stop();
    restore();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when another document writes the key", () => {
    const told = vi.fn<() => void>();
    const stop = localStore().subscribe("probe.other", told);

    globalThis.dispatchEvent(new StorageEvent("storage", { key: "probe.other" }));
    stop();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when another document clears the whole store", () => {
    const told = vi.fn<() => void>();
    const stop = localStore().subscribe("probe.wiped", told);

    globalThis.dispatchEvent(new StorageEvent("storage", { key: null }));
    stop();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("leaves a reader of another key alone", () => {
    const told = vi.fn<() => void>();
    const stop = localStore().subscribe("probe.mine", told);

    globalThis.dispatchEvent(new StorageEvent("storage", { key: "probe.theirs" }));
    stop();

    expect(told).not.toHaveBeenCalled();
  });

  it("stops telling a reader that unsubscribed", () => {
    const told = vi.fn<() => void>();
    const restore = holding();
    const stop = localStore().subscribe("probe.gone", told);

    stop();
    globalThis.dispatchEvent(new StorageEvent("storage", { key: "probe.gone" }));
    localStore().write("probe.gone", "one");
    restore();

    expect(told).not.toHaveBeenCalled();
  });
});
