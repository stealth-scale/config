import { describe, expect, it, vi } from "vitest";

import { cache, watchers } from "#store.ts";

describe("cache", () => {
  it("reads through where it holds nothing for the key", () => {
    expect(cache().through("a", () => "one")).toBe("one");
  });

  it("answers from what it holds rather than reading again", () => {
    const read = vi.fn<() => null | string>(() => "one");
    const held = cache();

    held.through("a", read);
    held.through("a", read);

    expect(read).toHaveBeenCalledTimes(1);
  });

  it("holds an absent value as well as a present one", () => {
    const read = vi.fn<() => null | string>(() => null);
    const held = cache();

    held.through("a", read);

    expect([held.through("a", read), read.mock.calls.length]).toStrictEqual([null, 1]);
  });

  it("reads again after the key is forgotten", () => {
    const read = vi.fn<() => null | string>(() => "one");
    const held = cache();

    held.through("a", read);
    held.forget("a");
    held.through("a", read);

    expect(read).toHaveBeenCalledTimes(2);
  });

  it("keeps another key when one is forgotten", () => {
    const read = vi.fn<() => null | string>(() => "one");
    const held = cache();

    held.through("a", read);
    held.through("b", read);
    held.forget("a");
    held.through("b", read);

    expect(read).toHaveBeenCalledTimes(2);
  });

  it("reads every key again when it forgets them all", () => {
    const read = vi.fn<() => null | string>(() => "one");
    const held = cache();

    held.through("a", read);
    held.through("b", read);
    held.forget(null);
    held.through("a", read);
    held.through("b", read);

    expect(read).toHaveBeenCalledTimes(4);
  });
});

describe("watchers", () => {
  it("calls back what is watching the key that changed", () => {
    const told = vi.fn<() => void>();
    const watching = watchers();

    watching.watch("a", told);
    watching.notify("a");

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("leaves what is watching another key alone", () => {
    const told = vi.fn<() => void>();
    const watching = watchers();

    watching.watch("a", told);
    watching.notify("b");

    expect(told).not.toHaveBeenCalled();
  });

  it("calls back every key when the change names none", () => {
    const first = vi.fn<() => void>();
    const second = vi.fn<() => void>();
    const watching = watchers();

    watching.watch("a", first);
    watching.watch("b", second);
    watching.notify(null);

    expect([first.mock.calls.length, second.mock.calls.length]).toStrictEqual([1, 1]);
  });

  it("calls back every reader of one key", () => {
    const first = vi.fn<() => void>();
    const second = vi.fn<() => void>();
    const watching = watchers();

    watching.watch("a", first);
    watching.watch("a", second);
    watching.notify("a");

    expect([first.mock.calls.length, second.mock.calls.length]).toStrictEqual([1, 1]);
  });

  it("stops calling back a reader that unwatched", () => {
    const told = vi.fn<() => void>();
    const watching = watchers();
    const stop = watching.watch("a", told);

    stop();
    watching.notify("a");

    expect(told).not.toHaveBeenCalled();
  });

  it("notifies a key nothing is watching without throwing", () => {
    const watching = watchers();

    expect(() => {
      watching.notify("a");
    }).not.toThrow();
  });
});
