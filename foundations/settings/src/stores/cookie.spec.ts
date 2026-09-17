import { describe, expect, it, vi } from "vitest";

import { cookieStore } from "#stores/cookie.ts";

function written(): { last: () => string; restore: () => void } {
  const own = Object.getOwnPropertyDescriptor(globalThis.document, "cookie");
  let held = "";

  Object.defineProperty(globalThis.document, "cookie", {
    configurable: true,
    get: () => held,
    set: (value: string) => {
      held = value;
    },
  });

  return {
    last: () => held,
    restore: () => {
      if (own === undefined) Reflect.deleteProperty(globalThis.document, "cookie");
      else Object.defineProperty(globalThis.document, "cookie", own);
    },
  };
}

function withoutDocument(): () => void {
  const own = Object.getOwnPropertyDescriptor(globalThis, "document");

  Reflect.deleteProperty(globalThis, "document");

  return () => {
    if (own !== undefined) Object.defineProperty(globalThis, "document", own);
  };
}

function shipping(): { change: () => void; restore: () => void; watching: () => number } {
  const listeners = new Set<() => void>();

  Object.defineProperty(globalThis, "cookieStore", {
    configurable: true,
    value: {
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    },
  });

  return {
    change: () => {
      for (const listener of listeners) listener();
    },
    restore: () => {
      Reflect.deleteProperty(globalThis, "cookieStore");
    },
    watching: () => listeners.size,
  };
}

describe("cookieStore", () => {
  it("reads a cookie out of the header it was built with", () => {
    const store = cookieStore({ header: "stealth.app.theme=fathom; other=1" });

    expect(store.read("stealth.app.theme")).toBe("fathom");
  });

  it("reads null for a cookie the header does not name", () => {
    expect(cookieStore({ header: "other=1" }).read("stealth.app.theme")).toBeNull();
  });

  it("reads null where the header is empty", () => {
    expect(cookieStore({ header: "" }).read("a")).toBeNull();
  });

  it("decodes a value that was encoded", () => {
    const store = cookieStore({ header: `a=${encodeURIComponent("one two")}` });

    expect(store.read("a")).toBe("one two");
  });

  it("reads a cookie out of the document where it was built with no header", () => {
    const jar = written();

    globalThis.document.cookie = "a=one";

    const read = cookieStore().read("a");

    jar.restore();

    expect(read).toBe("one");
  });

  it("writes the value under the key it is given", () => {
    const jar = written();

    cookieStore().write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("a=one");
  });

  it("writes a path of the whole origin where none is stated", () => {
    const jar = written();

    cookieStore().write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("Path=/");
  });

  it("writes the path it is given", () => {
    const jar = written();

    cookieStore({ path: "/docs" }).write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("Path=/docs");
  });

  it("writes a year of life where none is stated", () => {
    const jar = written();

    cookieStore().write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("Max-Age=31536000");
  });

  it("writes the life it is given", () => {
    const jar = written();

    cookieStore({ maxAge: 60 }).write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("Max-Age=60");
  });

  it("writes a lax same-site rule where none is stated", () => {
    const jar = written();

    cookieStore().write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("SameSite=lax");
  });

  it("writes the same-site rule it is given", () => {
    const jar = written();

    cookieStore({ sameSite: "strict" }).write("a", "one");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("SameSite=strict");
  });

  it("expires the cookie when the key is cleared", () => {
    const jar = written();

    cookieStore().clear("a");

    const last = jar.last();

    jar.restore();

    expect(last).toContain("Max-Age=0");
  });

  it("reads null where there is no document and no header", () => {
    const restore = withoutDocument();
    const read = cookieStore().read("a");

    restore();

    expect(read).toBeNull();
  });

  it("writes nowhere where there is no document", () => {
    const restore = withoutDocument();

    expect(() => {
      cookieStore().write("a", "one");
    }).not.toThrow();

    restore();
  });

  it("tells a reader when this document writes the key", () => {
    const jar = written();
    const told = vi.fn<() => void>();
    const store = cookieStore();
    const stop = store.subscribe("a", told);

    store.write("a", "one");
    stop();
    jar.restore();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when the key is cleared", () => {
    const jar = written();
    const told = vi.fn<() => void>();
    const store = cookieStore();
    const stop = store.subscribe("a", told);

    store.clear("a");
    stop();
    jar.restore();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("tells a reader when the browser reports a cookie change", () => {
    const shipped = shipping();
    const told = vi.fn<() => void>();
    const stop = cookieStore().subscribe("a", told);

    shipped.change();
    stop();
    shipped.restore();

    expect(told).toHaveBeenCalledTimes(1);
  });

  it("stops listening to the browser when the reader unsubscribes", () => {
    const shipped = shipping();
    const stop = cookieStore().subscribe("a", vi.fn<() => void>());

    stop();

    const watching = shipped.watching();

    shipped.restore();

    expect(watching).toBe(0);
  });

  it("reads the cookie again after the browser reports a change", () => {
    const shipped = shipping();
    const jar = written();
    const store = cookieStore();
    const stop = store.subscribe("a", vi.fn<() => void>());

    globalThis.document.cookie = "a=one";
    store.read("a");
    globalThis.document.cookie = "a=two";
    shipped.change();

    const read = store.read("a");

    stop();
    jar.restore();
    shipped.restore();

    expect(read).toBe("two");
  });

  it("reads the cookie again after it writes one itself", () => {
    const jar = written();
    const store = cookieStore();

    globalThis.document.cookie = "a=one";
    store.read("a");
    store.write("a", "two");

    const read = store.read("a");

    jar.restore();

    expect(read).toBe("two");
  });
});
